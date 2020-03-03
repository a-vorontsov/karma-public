import React from 'react';
import {Image, Dimensions} from "react-native";
import ActivitiesAllScreen from "../views/Activities/ActivitiesAllScreen";
import ActivitiesCausesScreen from '../views/Activities/ActivitiesCausesScreen';
import ActivitiesGoingScreen from '../views/Activities/ActivitiesGoingScreen';
import ActivitiesFavouritesScreen from '../views/Activities/ActivitiesFavouritesScreen';
import { createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createSwitchNavigator, createAppContainer} from "react-navigation";
import Colours from "../styles/Colours";
const {width, height} = Dimensions.get("window");

const ActivitiesTab = createMaterialTopTabNavigator(
    {  
        All: {
            screen: ActivitiesAllScreen,
            navigationOptions: {
                tabBarLabel: "All",
            }
        },
        Causes: {
            screen: ActivitiesCausesScreen,
            navigationOptions: {
                tabBarLabel: "Causes",
            }
        },
        Going: {
            screen: ActivitiesGoingScreen,
            navigationOptions: {
                tabBarLabel: "Going",
            }
        },
        Favourites: {
            screen: ActivitiesFavouritesScreen,
            navigationOptions: {
                tabBarLabel: "Favourites",
            }
        }
    },  
    {  
        tabBarOptions: {
            showLabel: true,
            allowFontScaling: false,
            inactiveTintColor: Colours.lightGrey,
            activeTintColor: Colours.white,
            labelStyle: {
                fontSize: 15,
                fontWeight: "500",
            },
            style: {
                borderTopColor: "transparent",
                borderTopWidth: 0,
                height: 80,
                backgroundColor: "red",
                width: width,
            },
        },
    }  

);

export default createAppContainer(ActivitiesTab);