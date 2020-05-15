console.log("Init starting");

// puppeteer is our headless chromium browser which unlike wget or curl will actually render the contents of the site and allow us to interact with it
console.log("Load puppeteer");
const puppeteer = require('puppeteer');

// the following are our twilio credentials (sign up for a free trial at https://www.twilio.com/referral/MyIhxE)
console.log("Load twilio");
const twilioConfig = require ('./twilio-settings');
const twilioClient = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);

// ifttt webhook integration
const IFTTT = require('node-ifttt-maker');
const iftttConfig = require('./ifttt-settings');
const ifttt = new IFTTT(iftttConfig.makerKey);

// load the config for the pages we're watching
console.log("Load page config");
const pages = require ('./pages');

// node schedule acts as a crontab, allowing us to set a schedule to run functions
console.log("Load job scheduler");
var schedule = require('node-schedule');

(async () => {
    // set the schedule frequency in minutes
    var scheduleFrequency = 60;

    // the following args are required for running chromium-browser in WSL2, probably not needed if running under native windows command, linux bash, or mac terminal.
    console.log("Init browser");
    const browser = await puppeteer.launch({
        args: ['--disable-gpu', '--single-process','--no-sandbox'] 
    });
    
    // basically our init script, schedule the job to run
    // run the first batch immediatly
    console.log("Init job");
    startJobs(pages);

    // schedule the recurring future jobs
    var j = schedule.scheduleJob('*/' + scheduleFrequency + ' * * * *', () => {
        startJobs(pages);
    });
    console.log("Next job runs at: " + j.nextInvocation());

    // open a new page, set the user agent, and browse to a url
    // returns Promise<ChromePage>
    async function OpenPage(url)
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
    async function Scrape(page)
    {
        var chromePage;
        // spawn a new page and get a URL
        OpenPage(page.url) //returns a chromePage
            .then(chromePageRes => {
                // set the page to a local variable so we can access it later.
                chromePage = chromePageRes;

                // take the chromepage and check for the selector
                return chromePage.waitFor(page.selector, {timeout: 20000}); 
            }) 
            .then(element => element.getProperty('textContent'), ()=> new MockJsHandle()) // if the selector exists, get the textContent property from it, error creates empty object
            .then(textContent => textContent.jsonValue()) // take the textContent property and return the jsonvalue
            .then(text => text.match(page.contains)) // take the json value and regex match it against the page contains value
            .then(result => {
                console.log(page.id + " result: " + result); 
                if(result){
                    // out of stock condition matched
                    console.log("Still out of stock");
                }else{
                    // no out of stock condition (result should be null);
                    SendNotification(page);
                }
            }).then(() => chromePage.close())
            .catch(err => {
                console.log(err)
            });

    }

    // send sms message
    // returns void
    async function SendNotification(page)
    {
        if(iftttConfig.enabled){
            const params = {value1: page.id, value2: page.url};
            ifttt
                .request({event: iftttConfig.eventName, params: params})
                .then((response) => {})
                .catch((err) => {});
        }
        
        if(twilioConfig.enabled){
            twilioClient.messages
            .create({
                body: page.notificationMsg,
                from: twilioConfig.callFromNumber,
                to: twilioConfig.callToNumbers[0]
            })
            .then(message => console.log("Text sent:" + message.sid));
        }

    }

    // itterate through our pages and scrape for stock status
    function startJobs(pages){
        console.log("Jobs start");
        for(i = 0; i < pages.length; i++){
            console.log(pages[i].id + " is starting");
            Scrape(pages[i]);
        }
    }
})();

// empty element to stand in for a proper element if none are found
function MockJsHandle() {
    return {
        jsonValue: function(){
            return '';
        }
    }
}