# NodeJS based product watcher
I bake a lot. Bread, pizza, more bread. These corona flour shortages have really put a cramp on my baking habits so instead of obsessivly mashing f5 on my favorite flour source, I built this simple watch script to check every 10 minutes and notify me via sms (a-la twilio) of any changes to the stock status.

You could scrape html content with something like curl or wget, but that only gets the static content. To support content that may be dynamically or pulled in after domready I'm using puppeteer, a headless chromium implemenation to load and render the page before checking the dom for the content.

## Installation
Clone this repository and npm install
```
$ git clone https://github.com/CuriouslyCory/ProductWatcher.git
$ cd ProductWatcher
$ npm i
```

Update the twilio-settings.js file with your own api keys.

Open the pages.js and add as many page records as you'd like to watch.

Run the script:
```
$ npm run start
```


## Configuration
./pages.js contains an array of page objects that define your watch
+ id - A Vanity id, that should be unique, to help decorate logs
+ url - The fully qualified url of the page that you'd like to scrape
+ selector - A valid CSS selector for the element that contains your out of stock message
+ contains - Text that the element contains that indicates it is out of stock
+ notificationMsg - Message text that you'll recieve via SMS when the out of stock message disappears. 

./twilio-settings.js contains your twilio account info as well as your target outbound numbers
+ accountSid : Found in your twilio account
+ authToken : Found in your twilio account
+ callFromNumber: Twilio outbound number,
+ callToNumbers: [Array of numbers to send texts out to upon item in stock]

./index.js
+ scheduleFrequency - Time in minutes between job runs

## Common issues
Puppeteer should load chromium by default, however if you're running on WSL you'll need to install chromium using apt first. The following is what ended up working for me.
```
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt install chromium-browser
```

If you get a console error complaining that it can't find a browser run ```$ npm i puppeteer``` from your install directory. For some reason it doesn't always install the chromium browser if installed from ```$ npm i```.
