import React from "react";

import {Image, TouchableOpacity, View, Text} from "react-native";
import {RegularText} from "../text";
import ActivityCard from "./ActivityCard";
import BottomModal from "../BottomModal";
import CarouselStyles from "../../styles/CarouselStyles";
import Colours from "../../styles/Colours";
import {useNavigation} from "react-navigation-hooks";
import ShareActivity from "../sharing/ShareActivity";

const icons = {
    share: require("../../assets/images/general-logos/export-logo.png"),
    profile: require("../../assets/images/general-logos/globe.png"),
};

class ActivityDisplayCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayShareModal: false,
        };
        this.toggleShareModal = this.toggleShareModal.bind(this);
    }
    navigation = this.props.navigation;
    setFav = handlePress => {
        return false;
    };

    toggleShareModal = event => {
        this.setState({
            displayShareModal: !this.state.displayShareModal,
        });
    };

    render() {
        const props = this.props;

        return (
            <View>
                <View
                    style={{
                        backgroundColor: Colours.backgroundWhite,
                        height: 60,
                        paddingHorizontal: 24,
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    <Image
                        source={icons.profile}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 75,
                            paddingHorizontal: 24,
                        }}
                        resizeMode="cover"
                    />
                    <View style={{alignItems: "center"}}>
                        <View
                            style={{alignItems: "flex-start", marginLeft: 30, paddingRight: 30}}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyItems: "flex-start",
                                    flexWrap:"wrap",
                                    backgroundColor:"blue",
                                }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        fontSize: 30,
                                        color: Colours.black,
                                        fontWeight: "500",
                                    }}>
                                    {props.activity.name}
                                </Text>
                            </View>
                            <View>
                                <RegularText
                                    style={{
                                        fontSize: 15,
                                        color: Colours.lightGrey,
                                        fontWeight: "500",
                                    }}>
                                    {props.activity.city}
                                    {props.activity.addressVisible &&
                                        `, ${props.activity.postcode}`}
                                </RegularText>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItem: "flex-start",
                            justifyContent: "flex-start",
                        }}>
                        <TouchableOpacity
                            style={{alignSelf: "flex-end"}}
                            onPress={this.toggleShareModal}>
                            <Image
                                source={icons.share}
                                style={{
                                    alignSelf: "flex-end",
                                    width: 30,
                                    height: 30,
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={CarouselStyles.itemContainer3}>
                    <View style={[CarouselStyles.item3]}>
                        <ActivityCard
                            activity={props.activity}
                            favourited={props.favourited}
                            signedup={
                                props.signedup
                                    ? props.signedup
                                    : props.activity.going
                            }
                        />
                    </View>
                </View>
                <BottomModal
                    visible={this.state.displayShareModal}
                    toggleModal={this.toggleShareModal}>
                    <ShareActivity activity={props.activity} />
                </BottomModal>
            </View>
        );
    }
}

export default props => {
    const navigation = useNavigation();
    return <ActivityDisplayCard {...props} navigation={navigation} />;
};
