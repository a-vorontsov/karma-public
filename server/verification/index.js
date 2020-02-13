// Twilio client setup
const accountSid = process.env.TWILIO_ACCOUND_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);

const isPhoneNumberValid = (number) => {
    const re = /^\+[1-9]\d{1,14}$/;
    return re.test(number);
};

module.exports = {
    startPhoneVerification: (number) => { // number in E.164 format (https://www.twilio.com/docs/glossary/what-e164)
        if (!isPhoneNumberValid(number)) {
            throw new Error("Invalid phone number: '" + number + "'");
        }
        return client.verify.services(serviceSid).verifications
            .create({to: number, channel: 'sms'});
    },

    checkPhoneVerification: (number, code) => {
        if (!isPhoneNumberValid(number)) {
            throw new Error("Invalid phone number: '" + number + "'");
        }

        return client.verify.services(serviceSid)
            .verificationChecks
            .create({to: number, code: code});
    },

    isPhoneNumberValid: isPhoneNumberValid,
};
