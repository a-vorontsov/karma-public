import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Switch,
} from "react-native";
import {RegularText} from "../../components/text";
import Styles from "../../styles/Styles";
import Colours from "../../styles/Colours";
import CarouselStyles from "../../styles/CarouselStyles";
import ActivityCard from "../../components/activities/ActivityCard";
import PageHeader from "../../components/PageHeader";
import {GradientButton, Button} from "../../components/buttons";
import {hasNotch} from "react-native-device-info";
import {ProgressBar} from 'react-native-paper';


const carouselEntries = [{individual: true}];

const {height: SCREEN_HEIGHT, width} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * width;

const icons = {
    share: require("../../assets/images/general-logos/export-logo.png"),
    profile: require("../../assets/images/general-logos/globe.png"),
    fave_inactive: require("../../assets/images/general-logos/fav-outline-profile.png"),
    fave_active: require("../../assets/images/general-logos/heart-red.png"),
    clock: require("../../assets/images/general-logos/clock-logo.png"),
    people: require("../../assets/images/general-logos/people-logo.png"),
    signup: require("../../assets/images/general-logos/favourite.png"),
    date: require("../../assets/images/general-logos/rectangle-blue.png"),
};

class ActivityInfoScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View style={[Styles.container, {backgroundColor:Colours.white, flexShrink: 1}]}>
                {/** HEADER */}
                <View
                    style={ [Styles.ph24, {
                        alignItems: "flex-start",
                        height: 0.08 * SCREEN_HEIGHT,
                        justifyContent: "flex-start",
                        marginTop: hasNotch() ? 40 : StatusBar.currentHeight,
                        backgroundColor: Colours.white,
                        marginBottom: 20
                    }]}>
                    <View style={{alignItems: "flex-start", width: FORM_WIDTH}}>
                        <PageHeader />
                    </View>
                    <View style={{marginBottom: 20, flexDirection: "row",}}>
                        <RegularText style={[Styles.pv16, {fontSize: 25, fontWeight: "500"}]}>
                            Activity Name Activity NameActivity NameActivity NameActivity NameActivity NameActivity Name
                        </RegularText>
                    </View>
                </View>
                <View style={{backgroundColor: Colours.backgroundWhite, height:60, paddingHorizontal: 24, flexDirection:"row", alignItems:"center"}}>
                        <Image
                            source={icons.profile}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 75,
                                paddingHorizontal: 24
                            }}
                            resizeMode="cover">
                        </Image>
                    <View style={{alignItems:"center"}}>
                        <View style={{alignItems:"flex-start", marginLeft:15}}>
                        <View style={{flexDirection:"row", alignItems:"center", justifyItems:"flex-start"}}>
                            <RegularText
                                style={{fontSize:20, color: Colours.black, fontWeight: "500"}}
                            >
                                Name
                            </RegularText>
                            <Image>
    
                            </Image>
                        </View>
                        <RegularText
                            style={{fontSize:15, color: Colours.lightGrey, fontWeight: "500"}}
                        >
                            Location
                        </RegularText>
                    </View>
                    </View>
                    <TouchableOpacity>
                        <Image
                            source={icons.share}
                            style={{
                                marginLeft:200,
                                alignSelf: "flex-end",
                                width: 30,
                                height: 30,
                            }}
                            resizeMode="contain">
                        </Image>
                    </TouchableOpacity>
                </View>
                
                <View style={[Styles.container, Styles.ph24]}>
                <View style={[Styles.pb24, Styles.bottom]}>
                <Image
                    source={require("../../assets/images/general-logos/hands-heart.png")}
                    style={{
                        flex: 1,
                        width: null,
                        height: null,
                        marginBottom: 10,
                    }}
                    resizeMode="cover"
                />
                <Image
                    source={icons.date}
                    style={{
                        position: "absolute",
                        top: 5,
                        left: 5,
                        height: 50,
                        width: 50,
                        resizeMode: "contain",
                    }}
                />
                <Image
                    source={icons.fave_active}
                    style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        height: 30,
                        width: 30,
                        resizeMode: "contain",
                    }}
                />
                <Image
                    source={icons.fave_active}
                    style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        height: 30,
                        width: 30,
                        resizeMode: "contain",
                    }}
                />
                <RegularText
                    style={{
                        position: "absolute",
                        top: 5,
                        left: 1,
                        height: 50,
                        width: 50,
                        fontSize: 20,
                        textAlign: "center",
                        fontWeight: "500",
                        color: "white",
                    }}>
                    {" "}
                    MON
                </RegularText>
                <RegularText
                    style={{
                        position: "absolute",
                        top: 25,
                        left: 0,
                        height: 50,
                        width: 50,
                        fontSize: 20,
                        textAlign: "center",
                        fontWeight: "500",
                        color: "white",
                    }}>
                    {" "}
                    DAY
                </RegularText>
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                        }}>
                            <ProgressBar color={Colours.blue} progress={0.75}/>
                            <RegularText>3/4 Spots Available</RegularText>
                    </View>
                </View>
                </View>
                <View style={{flexDirection:"row"}}>
                    <Image source={icons.date} style={{marginLeft:200,
                                alignSelf: "flex-end",
                                width: 30,
                                height: 30,}}/>
                    <View>
                        <RegularText
                                style={{fontSize:20, color: Colours.black, fontWeight: "500"}}
                            >
                                Name
                        </RegularText>
                        <RegularText
                            style={{fontSize:15, color: Colours.lightGrey, fontWeight: "500"}}
                        >
                            Location
                        </RegularText>

                    </View>
                </View>
                <View style={{flexDirection:"row"}}>
                    <View>

                    </View>
                </View>
            </View>

            {/** NEXT BUTTON */}
            <View
                style={{
                    height: 0.08 * SCREEN_HEIGHT,
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginBottom: 30,
                    backgroundColor: Colours.white
                }}>
                <View style={{width: FORM_WIDTH}}>
                    <GradientButton title="Attend" />
                </View>
            </View>
            </View>
        );
    }
}

export default ActivityInfoScreen;