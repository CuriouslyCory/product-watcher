// the following are our twilio credentials (sign up for a free trial at https://www.twilio.com/referral/MyIhxE)
// instead of storing the keys in this file you can store them as environment variables
// e.x. 
// $ export TWILIO_SID=XXXXXXXXXXXXXXXXXXXXXXXXXXX
// $ echo "export TWILIO_SID=XXXXXXXXXXXXXXXXXXXXXXXXXXX" >> ~/.bashrc

module.exports = {
    accountSid : process.env.TWILIO_SID ? process.env.TWILIO_SID : 'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
    authToken : process.env.TWILIO_TOKEN ? process.env.TWILIO_TOKEN : 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
    callFromNumber: process.env.TWILIO_NUMBER ? process.env.TWILIO_NUMBER : '+15555554202',
    callToNumbers: [process.env.RECIPIENT_NUMBER ? process.env.RECIPIENT_NUMBER : '+15555553797']
};