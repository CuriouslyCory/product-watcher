// the following settings allow connection to ifttt (sign up for free at at https://ifttt.com)
// instead of storing the keys in this file you can store them as environment variables
// e.x. 
// $ export MAKER_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXX
// $ echo "export MAKER_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXX" >> ~/.bashrc

module.exports = {
    enabled : process.env.IFTTT_ENABLED ? process.env.IFTTT_ENABLED : true,
    makerKey : process.env.MAKER_KEY ? process.env.MAKER_KEY : 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
    eventName : process.env.EVENT_NAME ? process.env.EVENT_NAME : 'some_event_name'
};
