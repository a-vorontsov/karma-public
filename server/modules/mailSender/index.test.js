const mailSender = require("./index");
const util = require("../../util/util");

beforeEach(() => {
    process.env.SKIP_MAIL_SENDING_FOR_TESTING = 0;
});

mailOptions = {
    email: process.env.EMAIL_ADDRESS,
    subject: "test subj",
    text: "test email body",
}

test("mail-sending works", async () => {
    if (process.env.RUN_ALL_TESTS != true) {
        return;
    }
    const sendResult = await mailSender.sendEmail(mailOptions.email, mailOptions.subject, mailOptions.text);
    expect(sendResult.success).toBe(true);
    expect(sendResult.message).toBe("Email sent to " + mailOptions.email);
});

test("bug report sending works", async () => {
    if (process.env.RUN_ALL_TESTS != true) {
        return;
    }
    const sendResult = await mailSender.sendBugReport(mailOptions.email, mailOptions.text);
    expect(sendResult.success).toBe(true);
    expect(sendResult.message).toBe("Email sent to " + process.env.BUG_REPORT_EMAIL_ADDRESS);
});

test("sending to invalid email fails as expected", async () => {
    const sendResult = await mailSender.sendEmail("invalidemailaddress", mailOptions.text);
    expect(sendResult.success).toBe(false);
    expect(sendResult.message).toBe("Email sending failed to invalidemailaddress");
});