# NodeJS based product watcher
I bake a lot. Bread, pizza, more bread. These corona flour shortages have really put a cramp on my baking habits so instead of obsessivly mashing f5 on my favorite flour source, I built this simple watch script to check every 10 minutes and notify me via sms (a-la twilio) of any changes to the stock status.

## Installation
Clone this repository
```$ git clone https://github.com/CuriouslyCory/ProductWatcher.git```

Update the twilio-settings.js file with your own api keys.
Open the pages.js and add as many page records as you'd like to watch.
Run the script:
```$ node index.js```

