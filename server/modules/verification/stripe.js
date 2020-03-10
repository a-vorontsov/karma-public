const stripe = require("stripe")(process.env.STRIPE_SECRET);
const fs = require("fs");

// @temporary array
const accounts = [];

/**
 * Upload an identity document picture
 * @param {number} userId
 */
async function uploadFile(userId) {
    let file = "";
    try {
        file = await stripe.files.create(
            {
                purpose: "userIdentity_document",
                file: {
                    data: fs.readFileSync("./routes/verify/temp/" + userId + ".jpg"),
                    name: userId + ".jpg",
                    type: "application/octet-stream",
                },
            },
            {
                stripeAccount: "{{" + process.env.STRIPE_ACC_ID + "}}",
            },
        );
    } catch (e) {
        // TODO: return upload error as response
    }
    accounts.push({
        id: userId,
        fileRef: file,
        timestamp: Date.now(),
        verified: false,
    });
    // console.log(accounts);
}

/**
 * Upload an identity document picture
 * @param {number} userId
 * @return {boolean} true if verified
 */
function updateAccount(userId) {
    return (
        accounts.find(account => account.id === userId).timestamp + 500 < Date.now()
    );
}

module.exports = {
    uploadFile: uploadFile,
    updateAccount: updateAccount,
};
