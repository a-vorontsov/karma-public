const passport = require("passport");
if (process.env.ENABLE_OAUTH === "1") {
    require("./google")(passport);
    require("./facebook")(passport);
    require("./linkedin")(passport);
}
