import React from "react";
import Sharing from "react-native-share";
import {View, Platform} from "react-native";
import {ShareButton} from "../buttons";
import Styles from "../../styles/Styles";
import {AppInstalledChecker} from "react-native-check-app-install";
import Clipboard from "@react-native-community/clipboard";
import Toast from "react-native-simple-toast";

/**
 * @class Share component is used whenever there is a share 
 * button on the screen. It manages the sharing pop-ups and redirection.
 */


export default class Share extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            installedApps: [],
        };
    }

    /**
     * Logic for which platform to launch depending on the user input
     * @param {*} linkType 
     */
    async openSharing(linkType) {
        const {title, message} = this.props;
        const shareOptions = {
            title,
            message,
        };
        switch (linkType) {
            case "facebook":
                shareOptions.social = Sharing.Social.FACEBOOK;
                break;
            case "twitter":
                shareOptions.social = Sharing.Social.TWITTER;
                break;
            case "linkedin":
                shareOptions.social = Sharing.Social.LINKEDIN;
                break;
            case "link":
                Clipboard.setString(message);
                Toast.showWithGravity(
                    "Message saved",
                    Toast.SHORT,
                    Toast.BOTTOM,
                );
                return;
            case "other":
                try {
                    await Sharing.open(shareOptions);
                } catch (err) {
                    // User did not share.
                }
                return;
        }
        Sharing.shareSingle(shareOptions);
    }
    /**
     * Handle the sharing on Android and iOS
     */
    async componentDidMount() {
        let installedApps = [];
        const apps = [
            {
                name: "facebook",
                title: "Facebook",
                package: "com.facebook.katana",
            },
            {
                name: "linkedin",
                title: "LinkedIn",
                package: "com.linkedin.android",
            },
            {
                name: "twitter",
                title: "Twitter",
                package: "com.twitter.android",
            },
        ];
        for (const app of apps) {
            const installed = await this.isInstalled(
                Platform.OS === "ios" ? app.name : app.package,
            );
            if (installed) {
                installedApps.push(app);
            }
        }
        this.setState({
            installedApps,
        });
    }
    
    /**
     * Check whether the user has the app installed before opening it
     * @param {*} app 
     */
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
                        title="Copy message"
                        onPress={() => this.openSharing("link")}
                    />
                </View>
                <View style={[Styles.pv8]}>
                    <ShareButton
                        title="Other"
                        onPress={() => this.openSharing("other")}
                    />
                </View>
            </View>
        );
    }
}
