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
import AddressInput from "../components/input/AddressInput";
import BottomModal from "../components/BottomModal";
import CauseContainer from "../components/causes/CauseContainer";
import {GradientButton} from "../components/buttons";

import {TextInput} from "../components/input";
import {ScrollView} from "react-native-gesture-handler";
import SignUpStyles from "../styles/SignUpStyles";
import {getData} from "../util/GetCredentials";
import CauseItem from "../components/causes/CauseItem";
import CauseStyles from "../styles/CauseStyles";
const request = require("superagent");
const {height: SCREEN_HEIGHT, width} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * width;
const CAUSES_WIDTH = 0.9 * width;


const icons = {
    new_cause: require("../assets/images/general-logos/new_cause.png"),
};
export default class CreateActivityScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            eventDesc: "",
            isAddressVisible: true,
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
            minSlotDate: new Date(),
            address1: "",
            region: "",
            city: "",
            postcode: "",
            displaySignupModal: false,
            causes: [],
            causeIds: [],
        };
        this.addSlot = this.addSlot.bind(this);
        this.removeSlot = this.removeSlot.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        console.disableYellowBox = true;
    }

    async componentDidMount() {
        const activity = this.props.navigation.getParam("activity");
        //event id is passed when updating an event
        if (activity) {
            try {
                const title = activity.name;
                const startDate = this.getFormattedDate(activity.date);
                const spots = activity.spots;
                const eventDesc = activity.content;
                const isAdditionalInfo = activity.addInfo;
                const isPhysical = activity.physical;
                const isWomenOnly = activity.womenOnly;
                const isAddressVisible = activity.addressVisible;
                const isIDReq = activity.photoId;
                const address1 = activity.address1;
                const addressId = activity.addressId;
                const address2 = activity.address2;
                const region = activity.region;
                const city = activity.city;
                const postcode = activity.postcode;
                const causeIds = activity.causes;
                
                const causes = await this.fetchSelectedCauses(causeIds);

                this.setState({
                    eventId: activity.id,
                    isUpdate: true,
                    addressId: addressId,
                    title,
                    startDate,
                    address1: address1,
                    address2: address2,
                    city,
                    region,
                    postcode,
                    numSpots: "" + spots,
                    isWomenOnly,
                    isAdditionalInfo,
                    eventDesc,
                    isPhysical,
                    isAddressVisible,
                    isIDReq,
                    causeIds,
                    causes
                });
            } catch (err) {
                Alert.alert("Server Error", err);
            }
        }
    }

    toggleModal = () => {
        this.setState({
            displaySignupModal: !this.state.displaySignupModal,
        });
    };

    handleError = (errorTitle, errorMessage) => {
        Alert.alert(errorTitle, errorMessage);
    };

    onUpdateCauses = inputState => {
        let causeIds = []
        inputState.selectedCauses.forEach(c => {
            causeIds.push(c.id);
        })
        this.setState({
            causes: inputState.selectedCauses,
            causeIds,
        })
        this.toggleModal();
    }

    fetchSelectedCauses = async(causeIds) => {
        const response = await request.get("http://localhost:8000/causes")
        .then(res => {
            return res.body.data;
        })

        let causes = [];
        Array.from(response).forEach(cause => {
            if(causeIds.includes(cause.id)) {
                causes.push(cause);
            }
        })

        return causes;
    }

    /**
     * Updates the user's already created event
     */
    updateEvent = async () => {
        if (
            !this.state.title ||
            !this.state.startDate ||
            !this.state.eventDesc ||
            !this.state.numSpots
        ) {
            return;
        }

        const credentials = await getData();
        const event = this.createEvent(credentials.username);

        const {navigate} = this.props.navigation;

        this.setState({
            submitPressed: true,
        });
        await request
            .post("http://localhost:8000/event/update/" + this.state.eventId)
            .send({
                // authToken: "ffa234124",
                userId: credentials.username,
                ...event,
            })
            .then(res => {
                Alert.alert("Successfully updated the event!", "", [
                    {text: "OK", onPress: () => navigate("Profile")},
                ]);
                console.log(res.body.data);
            })
            .catch(er => {
                Alert.alert("Server Error", er);
            });
    };

    onInputChange = inputState => {
        this.setState({
            address1: inputState.address1,
            address2: inputState.address2,
            city: inputState.city,
            region: inputState.region,
            postcode: inputState.postcode,
        });
    };

    createEvent(userId) {
        const event = {
            address: {
                id: this.state.addressId,
                address1: this.state.address1,
                //use empty string for address line 2 if user does not use it
                address2: this.state.address2 ? this.state.address2 : "",
                postcode: this.state.postcode,
                city: this.state.city,
                region: this.state.region,
                lat: 0.3,
                long: 100.5,
            }, //TODO
            name: this.state.title,
            womenOnly: this.state.isWomenOnly,
            spots: Number(this.state.numSpots),
            addressVisible: this.state.isAddressVisible,
            minimumAge: 18,
            photoId: this.state.isIDReq,
            physical: this.state.isPhysical,
            addInfo: this.state.isAdditionalInfo,
            content: this.state.eventDesc,
            date: this.state.startDate,
            userId: Number(userId),
            creationDate: new Date(), //returns current date
            causes: this.state.causeIds,
        };
        return event;
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

    getFormattedDate = date => {
        let newDate = new Date(date);
        //removes day and local timezone from date
        let formattedString = newDate.toUTCString().substring(5);
        formattedString = formattedString.slice(0, -7);
        return formattedString;
    };

    setDateValue = (date, name) => {
        this.setState({
            [name]: this.getFormattedDate(date),
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
    submit = async () => {
        const {navigate} = this.props.navigation;

        this.setState({
            submitPressed: true,
        });

        if (
            !this.state.title ||
            !this.state.startDate ||
            !this.state.eventDesc ||
            !this.state.numSpots
        ) {
            return;
        }
        const credentials = await getData();
        const event = this.createEvent(credentials.username);
        if(event.causes.length === 0){
            Alert.alert("An activity must be related to at least one cause");
            return;
        }
        
        // send a request to update the db with the new event
        await request
            .post("http://localhost:8000/event")
            .send({
                authToken: "ffa234124",
                userId: credentials.username,
                ...event,
            })
            .then(res => {
                Alert.alert("Successfully created the event!", "", [
                    {text: "OK", onPress: () => navigate("Profile")},
                ]);
                console.log(res.body.data)
            })
            .catch(er => {
                console.log(er.message);
            });
    };

    render() {
        let spotCount = this.state.numSpots
            ? parseInt(this.state.numSpots, 2)
            : 0;

        let pageTitle = this.state.isUpdate
            ? "Update Activity"
            : "Create Activity";
        let buttonText = this.state.isUpdate ? "Update" : "Create";

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
                        <PageHeader title={pageTitle} />
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
                            <View style={{width: FORM_WIDTH}}>
                                <View
                                    style={{
                                        width: FORM_WIDTH,
                                        paddingBottom: 20,
                                    }}>
                                    <RegularText>
                                        Lorem Ipsum dolor sit amet, conste
                                        ctetur adip isicing do eiut, sunt in
                                        culpa
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
                                            width: FORM_WIDTH,
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
                                                this.uploadPhoto(
                                                    this.state.photo,
                                                )
                                            }>
                                            <RegularText
                                                style={
                                                    (SignUpStyles.uploadButtonText,
                                                    {
                                                        fontSize: 20,
                                                        color: "gray",
                                                    })
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
                                        value={this.state.title}
                                        onSubmitEditing={() =>
                                            Keyboard.dismiss()
                                        }
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
                                                this.setDateValue(
                                                    date,
                                                    "startDate",
                                                )
                                            }
                                            locale="en_GB"
                                            minuteInterval={15}
                                        />
                                    </View>
                                )}

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
                                        placeholder={this.props.navigation.getParam("email")}
                                        style={{marginTop: 0}}
                                        editable="false"
                                    />
                                </View>
                                <SemiBoldText
                                    style={{
                                        alignItems: "flex-start",
                                        fontSize: 20,
                                    }}>
                                    Important
                                </SemiBoldText>
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
                                        onSubmitEditing={() =>
                                            Keyboard.dismiss()
                                        }
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
                                                isPhysical: !this.state
                                                    .isPhysical,
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
                                <View style={{flexDirection: "row"}}>
                                    <TextInput
                                        placeholder={"Display address to users"}
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
                                </View>
                               
                                    
                                   <View style={{width:FORM_WIDTH}}>
                                    <View
                                        style={{alignItems:"flex-start"}}
                                    >
                                        <RegularText style={{fontSize: 20}}>Pick Related Causes</RegularText>
                                        <TouchableOpacity
                                        onPress={this.toggleModal}>
                                        <Image
                                            source={icons.new_cause}
                                            style={{
                                                width: 60,
                                                height: 60,
                                                resizeMode: "contain",
                                            }}
                                        />
                                    </TouchableOpacity>
                                    </View>
                                            </View>
                                    <View style={{flexDirection: "row", width:CAUSES_WIDTH, justifyContent:"flex-end", alignSelf: "center"}}>
                                        {this.state.causes && this.state.causes.length > 0 ? (
                                            <View style={CauseStyles.createActivityContainer}> 
                                                {this.state.causes.map(cause => {
                                                    return (
                                                        <CauseItem 
                                                            cause={cause}
                                                            key={cause.id}
                                                            isDisabled={true}
                                                        />
                                                    )
                                                })}
                                            </View>
                                        ) : (undefined)}
                                    </View>
                                    

                                
                               <View>
                                <SemiBoldText
                                    style={{
                                        alignItems: "flex-start",
                                        fontSize: 20,
                                    }}>
                                    What is the location?
                                </SemiBoldText>

                                <AddressInput
                                    address1={this.state.address1}
                                    address2={this.state.address2}
                                    postcode={this.state.postcode}
                                    region={this.state.region}
                                    city={this.state.city}
                                    onChange={this.onInputChange}
                                />
                                </View>
                            </View>
                    
                        <BottomModal
                            visible={this.state.displaySignupModal}
                            toggleModal={this.toggleModal}>
                            <CauseContainer
                                onUpdateCauses={this.onUpdateCauses}
                                isActivity={true}
                                onSubmit={this.toggleModal}
                                onError={this.handleError}
                            />
                        </BottomModal>
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
                        <GradientButton
                            title={buttonText}
                            onPress={
                                this.state.isUpdate
                                    ? this.updateEvent
                                    : this.submit
                            }
                        />
                    </View>
                </View>
            </View>
        );
    }
}
