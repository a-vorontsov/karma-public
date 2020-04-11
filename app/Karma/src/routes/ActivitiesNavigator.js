import {createStackNavigator} from "react-navigation-stack";
import Colours from "../styles/Colours";

import ActivitiesScreen from "../views/Activities/ActivitiesScreen";
import CauseAllActivitiesScreen from "../views/Activities/CauseAllActivitiesScreen";
import ActivityInfoScreen from "../views/Activities/ActivityInfoScreen";

const ActivitiesNavigator = createStackNavigator(
    {
        Activities: {screen: ActivitiesScreen},
        ActivityInfo: {screen: ActivityInfoScreen},
        CauseAll: {screen: CauseAllActivitiesScreen},
    },
    {
        initialRouteName: "Activities",
        headerMode: "none",
        defaultNavigationOptions: {
            cardStyle: {
                backgroundColor: Colours.backgroundWhite,
            },
        },
    },
);

export default ActivitiesNavigator;
