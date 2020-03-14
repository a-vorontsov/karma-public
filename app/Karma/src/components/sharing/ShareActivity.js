import React from "react";
import Share from "react-native-share";
import {View, PlatformOSType} from "react-native";
import {ShareButton} from "../buttons";
import Styles from "../../styles/Styles";
import {AppInstalledChecker} from "react-native-check-app-install";

export default class ShareActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            installedApps: [],
        };
    }
    openSharing(linkType) {
        const {activity} = this.props;
        const shareOptions = {
            title: "This is a title",
            message: "this is a message",
            url: "this is a url",
        };
        switch (linkType) {
            case "facebook":
                shareOptions.social = Share.Social.FACEBOOK;
                break;
            case "twitter":
                shareOptions.social = Share.Social.TWITTER;
                break;
            case "linkedin":
                shareOptions.social = Share.Social.LINKEDIN;
                break;
        }
        Share.shareSingle(shareOptions);
    }
    async componentDidMount() {
        let installedApps = [];
        const apps = [
            {name: "facebook", title: "Facebook"},
            {name: "linkedin", title: "LinkedIn"},
            {name: "twitter", title: "Twitter"},
        ];
        for (const app of apps) {
            const installed = await this.isInstalled(app.name);
            if (installed) {
                installedApps.push(app);
            }
        }
        this.setState({
            installedApps,
        });
    }
    async isInstalled(app) {
        const installed = await AppInstalledChecker.isAppInstalled(app);
        return installed;
    }
    render() {
        const {installedApps} = this.state;
        return (
            <View style={Styles.pt16}>
                {installedApps.map(app => {
                    return (
                        <View style={[Styles.pv8]} key={app.name}>
                            <ShareButton
                                icon={app.name}
                                title={app.title}
                                onPress={() => this.openSharing(app.name)}
                            />
                        </View>
                    );
                })}

                <View style={[Styles.pv8]}>
                    <ShareButton
                        icon="link"
                        title="Copy Link"
                        onPress={() => this.openSharing("link")}
                    />
                </View>
            </View>
        );
    }
}
