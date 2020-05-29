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
### Page Watch List
./pages.js contains an array of page objects that define your watch
+ id - A Vanity id, that should be unique, to help decorate logs
+ url - The fully qualified url of the page that you'd like to scrape
+ selector - A valid CSS selector for the element that contains your out of stock message
+ contains - Text that the element contains that indicates it is out of stock
+ notificationMsg - Message text that you'll recieve via SMS when the out of stock message disappears. 

### Twilio integration
./twilio-settings.js contains your twilio account info as well as your target outbound numbers
+ enabled: Send alerts via SMS with twilio
+ accountSid : Found in your twilio account
+ authToken : Found in your twilio account
+ callFromNumber: Twilio outbound number,
+ callToNumbers: [Array of numbers to send texts out to upon item in stock]

### IFTTT integration
./ifttt-settings.js contains your ifttt integraion configuration
+ enabled: Send alerts to ifttt
+ makerKey : Can be found on https://ifttt.com/maker_webhooks/settings if you have webhooks configured
+ eventName : Event name defined in your ifttt webhook applet. Start at https://ifttt.com/create and select WebHooks for your "this"
In your "That" configuration {{Value1}} is passed page.id, {{Value2}} is passed page.url

### Important Variables
./index.js
+ scheduleFrequency - Time in minutes between job runs

## Docker
Product Watcher can be run as a Docker container. As of this time, the container isn't uploaded to Docker Hub. However, once you have built the container image, you must specify the following environment variables.

* TWILIO_SID
* TWILIO_TOKEN
* TWILIO_NUMBER
* RECIPIENT_NUMBER

A copy of `pages.js` must be mounted as a volume with the destination of `/app/pages.js`. Here is an example of a `docker run` command, assuming the environment variables are already defined in the shell.

```docker run --rm -v ${PWD}/pages.js:/app/pages.js -e TWILIO_SID -e TWILIO_TOKEN -e TWILIO_NUMBER -e RECIPIENT_NUMBER --name product-watcher docker.io/curiouslycory/product-watcher:0.0.0
```

## Common issues
### WSL2
Puppeteer should load chromium by default, however if you're running on WSL you'll need to install chromium using apt first. The following is what ended up working for me.
```
$ sudo apt-get update
$ sudo apt-get upgrade
$ sudo apt install chromium-browser
```

### Can't find browser (not WSL2)
If you get a console error complaining that it can't find a browser run ```$ npm i puppeteer``` from your install directory. For some reason it doesn't always install the chromium browser if installed from ```$ npm i```.
