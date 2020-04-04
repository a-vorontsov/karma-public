import React from "react";
import Share from "./Share";

const ShareActivity = props => {
    const {activity} = props;
    const title = "I'm using Karma!";
    const message = `I'm signing up for ${activity.name} with Karma!`;
    return <Share title={title} message={message} />;
};

export default ShareActivity;
