// puppeteer is our headless chromium browser which unlike wget or curl will actually render the contents of the site and allow us to interact with it
const puppeteer = require('puppeteer');
const twilioKeys = require ('./twilio-settings');
// the following are our twilio credentials (sign up for a free trial at https://www.twilio.com/referral/MyIhxE)
const client = require('twilio')(twilioKeys.accountSid, twilioKeys.authToken);

// node schedule acts as a crontab, allowing us to set a schedule to run functions
var schedule = require('node-schedule');

// sanitize our code
(async () => {
    
    // basically our init script, schedule the job to run every 10 minutes
    var j = schedule.scheduleJob('*/10 * * * *', () => {
        scrapeFlour();
    });

    // our async function to actually scrape the website and check stock
    async function scrapeFlour()
    {
        // the following args are required for running chromium-browser in WSL2
        const browser = await puppeteer.launch({
            args: ['--disable-gpu', '--single-process','--no-sandbox'] 
        });

        const page = await browser.newPage();

        // set the user agent to something the site will recognize and accept
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
        
        // open and render the page
        await page.goto('https://www.vitacost.com/bobs-red-mill-artisan-bread-flour-unbleached-enriched');

        // check for the element we're looking for, in this case, an out of stock message
        const element = await page.$(".pBuyMsgOOS");
        const text = await (await element.getProperty('textContent')).jsonValue();

        // if the element exists and returns out of stock, ignore
        if(text == "Out of stock"){ 
            console.log("Still out of stock");
        
        // if there is no out of stock message, send an sms via twilio
        }else{
            client.messages
                .create({
                body: 'Flour in stock!',
                from: '+12058801490',
                to: '+16026971135'
                })
                .then(message => console.log(message.sid));
                j.cancel();
        }


        await browser.close();
    }
})();