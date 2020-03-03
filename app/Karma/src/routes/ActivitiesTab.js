import React from 'react';
import {Image} from "react-native";
import ActivitiesAllScreen from "../views/Activities/ActivitiesAllScreen";
import ActivitiesCausesScreen from '../views/Activities/ActivitiesCausesScreen';
import ActivitiesGoingScreen from '../views/Activities/ActivitiesGoingScreen';
import ActivitiesFavouritesScreen from '../views/Activities/ActivitiesFavouritesScreen';
import { createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createSwitchNavigator, createAppContainer} from "react-navigation";

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
            activeTintColor: 'white',  
            showIcon: true,  
            showLabel:true,  
            style: {  
                backgroundColor:'red'  
            }  
        },  
    }  

);

export default createAppContainer(ActivitiesTab);