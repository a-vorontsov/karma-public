import React from "react";
import Share from "./Share";
const moment = require("moment");

const ShareActivity = props => {
    const {activity} = props;
    const title = "I'm using Karma!";
    const message = `I'm signing up for ${activity.name} on ${moment(activity.date).format("dddd, Do MMMM YYYY")} with Karma!`;
    console.log(message);
    return <Share title={title} message={message} />;
};

export default ShareActivity;
