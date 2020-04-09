import React from "react";
import Share from "./Share";

const ShareKarma = props => {
    const {profile} = props;
    const title = "I've been using Karma!";
    const message = `I have earned ${profile.points} points with Karma!`;
    return <Share title={title} message={message} />;
};

export default ShareKarma;
