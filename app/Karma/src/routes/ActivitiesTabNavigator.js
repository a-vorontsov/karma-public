import React from 'react';
import {Image, Dimensions, StyleSheet, Text, View} from "react-native";
import ActivitiesAllScreen from "../views/Activities/ActivitiesAllScreen";
import ActivitiesCausesScreen from '../views/Activities/ActivitiesCausesScreen';
import ActivitiesGoingScreen from '../views/Activities/ActivitiesGoingScreen';
import ActivitiesFavouritesScreen from '../views/Activities/ActivitiesFavouritesScreen';
import { createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {createSwitchNavigator, createAppContainer} from "react-navigation";
import posed from "react-native-pose";
import Colours from "../styles/Colours";
const {width, height} = Dimensions.get("window");

const tabWidth = width / 4;
const SpotLight = posed.View({
  route0: { x: 0 },
  Causes: { x: tabWidth },
  Going: { x: tabWidth * 2 },
  Favourites: { x: tabWidth * 3 }
});

const ActivitiesTab = createMaterialTopTabNavigator(
    {  
        All: {
            screen: ActivitiesAllScreen,
            navigationOptions: {
                tabBarLabel: "All",
                tabBarIcon: 
                        <View>
                            <Text>hi</Text>
                        </View>
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
            upperCaseLabel: false,
            showLabel: true,
            allowFontScaling: true,
            inactiveTintColor: Colours.lightGrey,
            activeTintColor: Colours.white,
            pressColor: Colours.blue,
            marginLeft: 20,
            indicatorStyle: { 
                backgroundColor: 'transparent', 
            },
            tabStyle:{
                alignItems: "center",
                width: 'auto'
            },
            labelStyle: {
                fontSize: 15,
                fontWeight: "700",
                fontFamily: "OpenSans-Regular",
                margin: 0,
                padding: 0,
            },
            style: {
                flex:1,
                borderTopColor: "transparent",
                borderTopWidth: 0,
                borderBottomWidth: 0,
                backgroundColor: "red",
                width: "100%",
                verticalMargin: 0,
                horizontalMargin: 0,
            },
        },
    }  

);

const styles = StyleSheet.create({
    spotLight: {
      width: tabWidth,
      height: "100%",
      backgroundColor: Colours.blue,
      borderRadius: 8
    }
  });

export default createAppContainer(ActivitiesTab);