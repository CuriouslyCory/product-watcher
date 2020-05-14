console.log("Init starting");
// puppeteer is our headless chromium browser which unlike wget or curl will actually render the contents of the site and allow us to interact with it
console.log("Load puppeteer");
const puppeteer = require('puppeteer');

console.log("Load twilio");
// the following are our twilio credentials (sign up for a free trial at https://www.twilio.com/referral/MyIhxE)
const twilioKeys = require ('./twilio-settings');
const client = require('twilio')(twilioKeys.accountSid, twilioKeys.authToken);

console.log("Load page config");
const pages = require ('./pages');

console.log("Load job scheduler");
// node schedule acts as a crontab, allowing us to set a schedule to run functions
var schedule = require('node-schedule');



// sanitize our code
(async () => {
    // set the schedule frequency in minutes
    var scheduleFrequency = 60;

    // the following args are required for running chromium-browser in WSL2, probably not needed if running under native windows command, linux bash, or mac terminal.
    console.log("Init browser");
    const browser = await puppeteer.launch({
        args: ['--disable-gpu', '--single-process','--no-sandbox'] 
    });
    
    
    // basically our init script, schedule the job to run
    console.log("Init job");
    // run the first batch immediatly
    startJobs(pages);

    // schedule the recurring future jobs
    var j = schedule.scheduleJob('*/' + scheduleFrequency + ' * * * *', () => {
        startJobs(pages);
    });
    console.log("Next job runs at: " + j.nextInvocation());

    

    // open a new page, set the user agent, and browse to a url
    // returns Promise<ChromePage>
    async function openPage(url)
    {
        var page; 
        return browser.newPage()
            .then((thisPage) => {
                console.log("Got new page, set user agent");
                page = thisPage;
                return page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
            })
            .then(() => {
                console.log("User agent set, go to URL: " + url);
                return page.goto(url);
            })
            .then(() => {
                console.log(url + " Loaded");
                return page
            });
    }

    // our async function to actually scrape the website and check stock
    // return void
    async function scrape(page)
    {
        var chromePage;
        // spawn a new page and get a URL
        openPage(page.url) //returns a chromePage
            .then(chromePageRes => {
                chromePage = chromePageRes;
                return chromePage.waitFor(page.selector); // take the chromepage and check for the selector
            }) 
            .then(element => {
                if(element){
                    return element.getProperty('textContent'); 
                }else{
                    // if the OOs element doesn't exist, is it back in stock?
                    sendNotification(page);
                    return;
                }
            }) // take the selector and return the textContent property
            .then(textContent => textContent.jsonValue()) // take the textContent property and return the jsonvalue
            .then(text => text.match(page.contains)) // take the json value and regex match it against the page contains value
            .then(result => {
                console.log("result: " + result); 
                if(result){
                    // out of stock condition matched
                    console.log("Still out of stock");
                }else{
                    // no out of stock condition (result should be null);
                    sendNotification(page);
                }
            }).then(() => {
                chromePage.close();
            })
            .catch(err => {
                console.log(err)
            });

    }

    // send sms message
    // returns promise<void>
    async function sendNotification(page)
    {
        return client.messages
            .create({
                body: page.notificationMsg,
                from: twilioKeys.callFromNumber,
                to: twilioKeys.callToNumbers[0]
            })
            .then(message => console.log("Text sent:" + message.sid));
    }

    function startJobs(pages){
        console.log("Jobs start");
        for(i = 0; i < pages.length; i++){
            console.log(pages[i].id + " is starting");
            scrape(pages[i]);
        }
    }
})();