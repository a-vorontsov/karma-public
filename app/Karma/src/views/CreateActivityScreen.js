import React from "react";
import {
    View,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    StatusBar,
    Switch,
    Keyboard,
    Alert,
} from "react-native";
import Styles from "../styles/Styles";
import {hasNotch} from "react-native-device-info";
import PhotoUpload from "react-native-photo-upload";
import DatePicker from "react-native-date-picker";
import PageHeader from "../components/PageHeader";
import {RegularText, SemiBoldText} from "../components/text";

import {GradientButton} from "../components/buttons";

import TextInput from "../components/TextInput";
import {ScrollView} from "react-native-gesture-handler";
import SignUpStyles from "../styles/SignUpStyles";
const {height: SCREEN_HEIGHT, width} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * width;

export default class CreateActivityScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eventDesc: "",
            isAddressVisible: false,
            isWomenOnly: false,
            isIDReq: false,
            isPhysical: false,
            isAdditionalInfo: false,
            startDate: "",
            endDate: "",
            title: "",
            address: "",
            isStartDateVisible: false,
            isEndDateVisible: false,
            slots: [""],
            numSpots: "",
            submitPressed: false,
            minEndDate: new Date(),
        };

        console.disableYellowBox = true;
    }

    uploadPhoto(selectedPhoto) {
        if (selectedPhoto != null) {
            Alert.alert("Success!", "Your new photo has been uploaded.");
        } else {
            Alert.alert("Error", "Please upload a photo.");
        }
    }

    showDatePicker = name => {
        if (name === "isStartDateVisible") {
            this.setState({
                isEndDateVisible: false,
            });
        } else {
            this.setState({
                isStartDateVisible: false,
            });
        }
        this.setState({
            [name]: !this.state[name],
        });
    };

    setDateValue = (date, name) => {
        //events must be at least one hour long
        if (name === "startDate") {
            const min = new Date(date);
            min.setHours(min.getHours() + 1);

            this.setState({
                minEndDate: min,
                isStartDateVisible: false,
                isEndDateVisible: true,
            });
        }
        //removes day and local timezone from date
        let formattedString = date.toUTCString().substring(5);
        formattedString = formattedString.slice(0, -7);
        this.setState({
            [name]: formattedString,
        });
    };

    addSlot = () => {
        this.setState(prevState => {
            let {slots} = prevState;
            return {
                slots: slots.concat(""),
            };
        });
    };

    removeSlot = i => {
        this.setState(prevState => {
            let slots = prevState.slots.slice();

            slots.splice(i, 1);

            return {slots};
        });
    };

    onChangeSpotsAvail = event => {
        const {name, text} = event;
        let number = parseInt(text, 2);

        //limit the max number of slots to 100
        if (number > 100 || text.length > 3) {
            let limited = text.slice(0, -1);

            if (name === "numPad") {
                this.setState({
                    [name]: "" + limited,
                });
            }
        } else {
            this.setState({
                [name]: text,
            });
        }
    };

    onChangeText = event => {
        const {name, text} = event;

        this.setState({[name]: text});
    };

    /**
     * Submits activity information and
     * goes back to Profile page
     */
    submit = () => {
        const {navigate} = this.props.navigation;

        this.setState({
            submitPressed: true,
        });

        if (
            !this.state.title ||
            !this.state.startDate ||
            !this.state.endDate ||
            !this.state.eventDesc ||
            !this.state.numSpots
        ) {
            return;
        }

        navigate("Profile");
    };

    render() {
        let spotCount = this.state.numSpots
            ? parseInt(this.state.numSpots, 2)
            : 0;

        return (
            <View style={Styles.container}>
                {/** HEADER */}
                <View
                    style={{
                        alignItems: "center",
                        height: 0.08 * SCREEN_HEIGHT,
                        justifyContent: "flex-start",
                        marginTop: hasNotch() ? 40 : StatusBar.currentHeight,
                    }}>
                    <View style={{alignItems: "flex-start", width: FORM_WIDTH}}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignContent: "center",
                            }}>
                            <TouchableOpacity
                                onPress={() => navigate("InitSignup")}>
                                <Image
                                    style={{
                                        width: 30,
                                        height: 40,
                                        resizeMode: "contain",
                                        flex: 1,
                                    }}
                                    source={require("../assets/images/general-logos/back-arrow.png")}
                                />
                            </TouchableOpacity>
                            <RegularText
                                style={{
                                    fontSize: 30,
                                    fontWeight: "500",
                                    color: "#3E3E3E",
                                    paddingLeft: 20,

                                    justifyContent: "center",
                                }}>
                                Create Activity
                            </RegularText>
                        </View>
                    </View>
                </View>

                <KeyboardAvoidingView
                    style={{flex: 1}}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View
                            style={{
                                minHeight: SCREEN_HEIGHT,
                                justifyContent: "space-evenly",
                                alignItems: "center",
                            }}>
                            <View
                                style={{width: FORM_WIDTH, paddingBottom: 20}}>
                                <RegularText>
                                    Lorem Ipsum dolor sit amet, conste ctetur
                                    adip isicing do eiut, sunt in culpa
                                </RegularText>
                            </View>
                            <View style={{width: FORM_WIDTH}}>
                                <RegularText
                                    style={{
                                        marginLeft: 30,
                                        paddingBottom: 10,
                                        fontSize: 20,
                                    }}>
                                    Add Photo
                                </RegularText>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "flex-start",
                                    }}>
                                    <PhotoUpload
                                        containerStyle={{
                                            alignItems: "center",
                                        }}
                                        onPhotoSelect={avatar => {
                                            if (avatar) {
                                                this.setPhoto(avatar);
                                            }
                                        }}>
                                        <Image
                                            style={{
                                                paddingVertical: 10,
                                                width: 50,
                                                height: 50,
                                                borderRadius: 75,
                                            }}
                                            resizeMode="cover"
                                            source={require("../assets/images/general-logos/photo-logo.png")}
                                        />
                                    </PhotoUpload>

                                    <TouchableOpacity
                                        style={SignUpStyles.uploadButton}
                                        onPress={() =>
                                            this.uploadPhoto(this.state.photo)
                                        }>
                                        <RegularText
                                            style={
                                                (SignUpStyles.uploadButtonText,
                                                {fontSize: 20, color: "gray"})
                                            }>
                                            Upload Photo
                                        </RegularText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                <TextInput
                                    placeholder="Title"
                                    showError={
                                        !this.state.title &&
                                        this.state.submitPressed
                                    }
                                    name="title"
                                    onChange={this.onChangeText}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                />
                            </View>
                            {/** EVENT START DATE
                             */}
                            <View>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.showDatePicker(
                                            "isStartDateVisible",
                                        )
                                    }
                                    style={{
                                        backgroundColor: "#f8f8f8",
                                        zIndex: 50,
                                    }}>
                                    <View style={{flexDirection: "row"}}>
                                        <TextInput
                                            pointerEvents="none"
                                            placeholder="Start"
                                            editable={false}
                                            showError={
                                                this.state.submitPressed &&
                                                !this.state.startDate
                                            }
                                            value={this.state.startDate}
                                        />
                                        <Image
                                            style={{
                                                position: "absolute",
                                                right: 0,
                                                top: 20,
                                                height: 20,
                                                width: 20,
                                            }}
                                            source={require("../assets/images/general-logos/calendar-dark.png")}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {this.state.isStartDateVisible && (
                                <View>
                                    <DatePicker
                                        mode="datetime"
                                        onDateChange={date =>
                                            this.setDateValue(date, "startDate")
                                        }
                                        locale="en_GB"
                                        minuteInterval={15}
                                    />
                                </View>
                            )}
                            {/** END DATE  */}
                            <View>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.showDatePicker("isEndDateVisible")
                                    }>
                                    <View style={{flexDirection: "row"}}>
                                        <TextInput
                                            placeholder="End"
                                            pointerEvents="none"
                                            editable={false}
                                            showError={
                                                this.state.submitPressed &&
                                                !this.state.endDate
                                            }
                                            value={this.state.endDate}
                                        />
                                        <Image
                                            style={{
                                                position: "absolute",
                                                right: 0,
                                                top: 20,
                                                height: 20,
                                                width: 20,
                                            }}
                                            source={require("../assets/images/general-logos/calendar-dark.png")}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            {this.state.isEndDateVisible && (
                                <Animated.View>
                                    <View>
                                        <DatePicker
                                            mode="datetime"
                                            onDateChange={date =>
                                                this.setDateValue(
                                                    date,
                                                    "endDate",
                                                )
                                            }
                                            minuteInterval={15}
                                        />
                                    </View>
                                </Animated.View>
                            )}

                                        <View
                                            style={{alignItems: "flex-start"}}>
                                            <TimeSlot
                                                minDate={this.state.minSlotDate}
                                                maxDate={this.state.maxSlotDate}
                                                style={{
                                                    width: FORM_WIDTH * 0.9,
                                                }}
                                            />
                                            {/** only show delete icon if it's not the first slot */}
                                            {index !== 0 ? (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        this.removeSlot(index)
                                                    }
                                                    style={{
                                                        position: "absolute",
                                                        right: 0,
                                                        top: 25,
                                                    }}>
                                                    <Image
                                                        style={{
                                                            height: 20,
                                                            width: 20,
                                                            borderRadius: 25,
                                                        }}
                                                        source={require("../assets/images/general-logos/cross.png")}
                                                    />
                                                </TouchableOpacity>
                                            ) : null}
                                        </View>
                                    </View>
                                )}
                                keyExtractor={item => item.toString()}
                            />
                            <View
                                style={{
                                    width: FORM_WIDTH,
                                    flexDirection: "row",
                                    justifyContent: "flex-end",
                                }}>
                                <View>
                                    <RegularText
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                        }}>
                                        Add another slot
                                    </RegularText>
                                </View>

                                <TouchableOpacity
                                    style={{paddingLeft: 10}}
                                    onPress={() => this.addSlot()}>
                                    <Image
                                        style={{
                                            height: 20,
                                            width: 20,
                                            borderRadius: 10,
                                        }}
                                        source={require("../assets/images/general-logos/photo-plus.png")}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TextInput
                                    inputRef={ref => (this.address = ref)}
                                    placeholder={"Address"}
                                    onChange={this.onChangeText}
                                    showError={
                                        this.state.submitPressed &&
                                        !this.state.address
                                    }
                                />
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <TextInput
                                    placeholder="Make address visible"
                                    editable={false}
                                />
                                <Switch
                                    style={{position: "absolute", right: 0}}
                                    onValueChange={() =>
                                        this.setState({
                                            isAddressVisible: !this.state
                                                .isAddressVisible,
                                        })
                                    }
                                    value={this.state.isAddressVisible}
                                />
                            </View>

                            <TextInput
                                placeholder="What will volunteers do?"
                                multiline
                                name="eventDesc"
                                onChange={this.onChangeText}
                                showError={
                                    this.state.submitPressed &&
                                    !this.state.eventDesc
                                }
                                value={this.state.eventDesc}
                                onSubmitEditing={() => Keyboard.dismiss()}
                            />
                            <View>
                                <SemiBoldText style={{fontSize: 20}}>
                                    Who to contact
                                </SemiBoldText>
                                <TextInput
                                    placeholder="team-team@gmail.com"
                                    style={{marginTop: 0}}
                                />
                            </View>
                            <View style={{width: FORM_WIDTH}}>
                                <SemiBoldText
                                    style={{
                                        alignItems: "flex-start",
                                        fontSize: 20,
                                    }}>
                                    Important
                                </SemiBoldText>
                            </View>

                            <View>
                                <TextInput
                                    placeholder="Number of spots available"
                                    name="numSpots"
                                    keyboardType="number-pad"
                                    showError={
                                        this.state.submitPressed &&
                                        !this.state.numSpots
                                    }
                                    errorText={
                                        spotCount <= 0
                                            ? "Must have at least 1 spot available"
                                            : null
                                    }
                                    onChange={this.onChangeSpotsAvail}
                                    returnKeyType="done"
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                    value={this.state.numSpots}
                                />
                            </View>

                            <View style={{flexDirection: "row"}}>
                                <TextInput
                                    placeholder="Women only event"
                                    editable={false}
                                />
                                <Switch
                                    style={{position: "absolute", right: 0}}
                                    onValueChange={() =>
                                        this.setState({
                                            isWomenOnly: !this.state
                                                .isWomenOnly,
                                        })
                                    }
                                    value={this.state.isWomenOnly}
                                />
                            </View>

                            <View style={{flexDirection: "row"}}>
                                <TextInput
                                    placeholder="Photo ID required"
                                    editable={false}
                                />
                                <Switch
                                    style={{position: "absolute", right: 0}}
                                    onValueChange={() =>
                                        this.setState({
                                            isIDReq: !this.state.isIDReq,
                                        })
                                    }
                                    value={this.state.isIDReq}
                                />
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <TextInput
                                    placeholder="This is a physical activity"
                                    editable={false}
                                />
                                <Switch
                                    style={{position: "absolute", right: 0}}
                                    onValueChange={() =>
                                        this.setState({
                                            isPhysical: !this.state.isPhysical,
                                        })
                                    }
                                    value={this.state.isPhysical}
                                />
                            </View>
                            <View style={{flexDirection: "row"}}>
                                <TextInput
                                    style={{fontSize: 13}}
                                    placeholder={
                                        "Additional information will be \nprovided by email"
                                    }
                                    editable={false}
                                    multiline
                                />
                                <Switch
                                    style={{position: "absolute", right: 0}}
                                    onValueChange={() =>
                                        this.setState({
                                            isAdditionalInfo: !this.state
                                                .isAdditionalInfo,
                                        })
                                    }
                                    value={this.state.isAdditionalInfo}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                {/** NEXT BUTTON */}
                <View
                    style={{
                        height: 0.08 * SCREEN_HEIGHT,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginBottom: 30,
                    }}>
                    <View style={{width: FORM_WIDTH}}>
                        <GradientButton title="Create" onPress={this.submit} />
                    </View>
                </View>
            </View>
        );
    }
}
