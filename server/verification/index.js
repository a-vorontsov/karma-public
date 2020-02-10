// Twilio client setup
const accountSid = process.env.TWILIO_ACCOUND_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);

module.exports = {
    startPhoneVerification: (number) => {  // number in E.164 format (https://www.twilio.com/docs/glossary/what-e164)
        return client.verify.services(serviceSid)
            .verifications
            .create({to: number, channel: 'sms'})
    },

    checkPhoneVerification: (number, code) => {
        return client.verify.services(serviceSid)
            .verificationChecks
            .create({to: number, code: code})
    }
};