import React, {Component} from "react";
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, SafeAreaView, TouchableOpacity, Image, Platform, ScrollView, BackHandler,} from "react-native";
import { RegularText, TitleText, SemiBoldText, LogoText } from "../components/text";
import { GradientButton } from "../components/buttons";
import PhotoUpload from 'react-native-photo-upload';
import Styles from "../styles/Styles";
import CarouselStyles, {itemWidth, sliderWidth} from "../styles/CarouselStyles";
import Carousel, {Pagination} from "react-native-snap-carousel";
import ActivityCard from "../components/ActivityCard";

const carouselEntries = [{individual: true}, {individual: false}];

const { width, height } = Dimensions.get("window")
const formWidth = 0.8 * width;
const icons = {
    cog: require("../assets/images/general-logos/cog.png"),
    badge: require("../assets/images/general-logos/badges-logo.png"),
    edit_white: require("../assets/images/general-logos/edit-white.png"),
    edit_grey: require("../assets/images/general-logos/edit-grey.png"),
    photo_add: require('../assets/images/general-logos/photo-plus-background.png')
}

class ProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
        };
    }

    static navigationOptions = {
        headerShown: false,
    };

    _renderItem = ({item}) => {
        return (
            <View style={CarouselStyles.itemContainer}>
                <View style={[CarouselStyles.item, CarouselStyles.shadow]}>
                    <ActivityCard individual={item.individual} />
                </View>
            </View>
        );
    };

    render() {
        return (
            // {this.props.navigation.getParam('name', null)}
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#00A8A6',
                    height: 45,
                    width: width,
                    flexDirection: "row"
                }}/>
            <SafeAreaView>
            <View style={{flex: 1, backgroundColor: '#00A8A6', justifyContent: "space-between", position: "absolute", left:0, top: 0,flexDirection: "row-reverse"}}>
                    <Image source={icons.cog} style={{ height: 25, width: 25, paddingRight: 10}}></Image>
                    <Image source={icons.edit_white} style={{ height: 25, width: 25}}></Image>
            </View>
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#00A8A6',
                    height: 180,
                    width: width,
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingRight: 30,
                    flexDirection: "row"
                }}>
                <PhotoUpload
                onPhotoSelect={avatar => {
                    if (avatar) {
                        console.log('Image base64 string: ', avatar),
                        this.setPhoto(avatar)
                    }
                }}
                >
                    <Image
                        style={{
                        paddingVertical: 5,
                        width: 140,
                        height: 140,
                        borderRadius: 75,
                        }}
                        resizeMode='cover'
                        source={icons.photo_add}
                    />
                 </PhotoUpload>
                <View>
                    <RegularText style={styles.nameText}>Name</RegularText>
                    <View
                        style={{
                            flexDirection: "row"
                        }}>
                        <Text style={styles.usernameText}>Username</Text>
                        <Text style={styles.locationText}>Location</Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            paddingTop:20, 
                            justifyContent: 'space-between'
                        }}>
                        <Image source={icons.badge} style={{height: 60, width: 60}}></Image>
                        <Image source={icons.edit_white} style={{ height: 20, width: 20}}></Image>
                    </View>
                </View>
            </View>
            <View 
                style={{
                    flex: 5,
                    backgroundColor:"white",
                    paddingVertical: 25,
                }}>
                <View style={{alignItems: "center",
                    justifyContent: "center",}}>
                <GradientButton title='Create Activity' width={350}></GradientButton>
                </View>
                <View style={{flex:1, paddingLeft: 30, alignItems: "flex-start", justifyContent: "flex-start", paddingTop: 20}}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-start", justifyContent: "space-evenly"}}>
                        <RegularText style={styles.bioHeader}>Activity</RegularText>
                        <Image source={icons.edit_grey} style={{ height: 25, width: 25}}></Image>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row"}}>
                        <RegularText style={styles.contentText}>Availability:</RegularText>
                        <RegularText style={styles.answerText}>DATES</RegularText>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row"}}>
                        <RegularText style={styles.contentText}>Activity Date:</RegularText>
                        <RegularText style={styles.answerText}>DATES</RegularText>
                    </View>
                    <View style={{ flex: 1, flexDirection: "row"}}>
                        <RegularText style={styles.contentText}>Women Only:</RegularText>
                        <RegularText style={styles.answerText}>HECK YES</RegularText>
                    </View>
                    <RegularText style={styles.bioHeader}>Bio</RegularText>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", paddingRight: 40}}>
                    <RegularText style={styles.contentText}>o eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga</RegularText>
                    </View>
                    <RegularText style={styles.bioHeader}>Causes</RegularText>
                </View>
            </View>
            <View style={{flex:1, paddingLeft: 30, alignItems: "flex-start", justifyContent: "flex-start"}}>
            <RegularText style={styles.bioHeader}>Upcoming Events</RegularText>
                <View>
                    <Carousel
                        ref={c => {
                            this._carousel = c;
                        }}
                        data={carouselEntries}
                        removeClippedSubviews={false}
                        renderItem={this._renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        inactiveSlideOpacity={1}
                        inactiveSlideScale={1}
                        containerCustomStyle={CarouselStyles.slider}
                        onSnapToItem={index =>
                            this.setState({activeSlide: index})
                        }
                    />
                </View>
            </View>
            </SafeAreaView>
            </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    topicHeaderContainer: {

    },
    nameText: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold'
    },
    usernameText: {
        fontSize: 20,
        color: 'white',
    },
    locationText: {
        fontSize: 20,
        color: '#75C4C3',
        paddingLeft: 10
    },
    bioHeader: {
        paddingTop: 25,
        fontSize: 20,
        color: 'black',
        fontWeight: '500',
    },
    contentText: {
        fontSize: 15,
        color: 'black',
        paddingVertical: 5
    },
    answerText: {
        fontSize: 15,
        color: '#00A8A6',
        paddingVertical: 5,
        paddingLeft: 5
    }

})

export default ProfileScreen;
