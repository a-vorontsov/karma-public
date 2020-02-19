const stripe = require("stripe")(process.env.STRIPE_SECRET);
const fs = require("fs");

/**
 * Upload an identity document picture
 * @param {Integer} userId
 */
function uploadFile(userId) {
    const file = stripe.files.create(
        {
            purpose: "userIdentity_document",
            file: {
                data: fs.readFileSync("./verify/temp/" + userId),
                name: (userId + ".jpg"),
                type: "application/octet-stream",
            },
        },
        {
            stripe_account: "{{" + process.env.STRIPE_ACC_userId + "}}",
        },
    );
    console.log(file);
}

/**
 * Upload an identity document picture
 * @param {Integer} userId
 * @return {boolean} true if verified
 */
function updateAccount(userId) {
    return true;
}

module.exports = {
    uploadFile: uploadFile,
    updateAccount: updateAccount,
};
