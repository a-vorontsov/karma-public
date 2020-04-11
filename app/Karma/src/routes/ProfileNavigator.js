import {createStackNavigator} from "react-navigation-stack";
import Colours from "../styles/Colours";

import SettingsNavigator from "./SettingsNavigator";

import CreatedActivitiesScreen from "../views/Activities/CreatedActivitiesScreen";
import Attendees from "../views/Activities/Attendees";
import SignUpRequests from "../views/Activities/SignUpRequests";
import ViewSignUpsScreen from "../views/Activities/ViewSignUpsScreen";
import ProfileScreen from "../views/ProfileScreen";
import ProfileEditScreen from "../views/ProfileEditScreen";
import PickCausesScreen from "../views/PickCausesScreen";
import CreateActivityScreen from "../views/CreateActivityScreen";

const ProfileNavigator = createStackNavigator(
    {
        Profile: {screen: ProfileScreen},
        ProfileEdit: {screen: ProfileEditScreen},
        PickCauses: {screen: PickCausesScreen},
        Settings: {screen: SettingsNavigator},
        CreatedActivities: {screen: CreatedActivitiesScreen},
        ViewSignUps: {screen: ViewSignUpsScreen},
        Attendees: {screen: Attendees},
        SignUpRequests: {screen: SignUpRequests},
        CreateActivity: {
            screen: CreateActivityScreen,
        },
    },
    {
        headerMode: "none",
        defaultNavigationOptions: {
            cardStyle: {
                backgroundColor: Colours.backgroundWhite,
            },
        },
    },
);

export default ProfileNavigator;
