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
    Animated,
    FlatList,
    Keyboard,
} from "react-native";
import Styles from "../styles/Styles";
import {hasNotch} from "react-native-device-info";
import PhotoUpload from "react-native-photo-upload";
import DatePicker from "react-native-date-picker";
import {
    RegularText,
    TitleText,
    SemiBoldText,
    BoldText,
} from "../components/text";

import {GradientButton, Button} from "../components/buttons";

import TextInput from "../components/TextInput";
import {ScrollView} from "react-native-gesture-handler";
import SignUpStyles from "../styles/SignUpStyles";
const {height: SCREEN_HEIGHT, width} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * width;
var SLOT_KEY_ID = 0;

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
            startDate: new Date(),
            endDate: new Date(),
            title: "",
            time: new Date(),
            timeValue: "",
            date: new Date().getT,
            minTime: new Date().getUTCSeconds(),
            isStartDateVisible: false,
            visible: false,
            y: new Animated.Value(-50),
            minYear: new Date().getFullYear(),
            slots: [""],
            submitPressed: false,
            
        };

        console.disableYellowBox = true;
    }

    slide = () => {

        Animated.timing(this.state.y, {
          toValue: -20,
          duration: 500
        }).start();
        this.setState({
          
          isStartDateVisible: true
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


    // setDate(selectedDate) {
    //     this.setState({date: selectedDate});

    //     //events can only be scheduled for the current day and the future
    //     if (selectedDate.getFullYear() >= this.state.minYear) {
    //         this.setState({
    //             validDateSelected: true,
    //         });
    //     } else {
    //         this.setState({
    //             validDateSelected: false,
    //         });
    //     }
    // }

    onChangeText = event => {
        const {name, text} = event;

        this.setState({[name]: text});
    };

    submit = () => {
        this.setState({
            submitPressed:true
        })
    }

    render() {
        const {navigate} = this.props.navigation;

        
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
                                    showError={!this.state.title && this.state.submitPressed}
                                />

                            </View>
                            {/** EVENT START DATE 
                             * 
                             * TODO - update the start date everytime the date is changed
                            */}
                            <View>
                            <TouchableOpacity onPress={() => this.slide()}>
                                <View style={{flexDirection: "row"}}>
                                    <TextInput
                                        placeholder="Start"
                                        editable={false}
                                        
                                        value={
                                            this.state.validDateSelected
                                                ? this.state.date.toDateString()
                                                : null
                                        }
                                        showError={
                                            this.state.submitPressed
                                                ? !this.state.date
                                                : false
                                        }

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
                            {this.state.isStartDateVisible
                            && 
                            <Animated.View
                            style={{
                                transform: [
                                {
                                    translateY: this.state.y
                                }
                                ]
                            }}
                        >
                            <View><DatePicker 
                                mode="datetime"
                            /></View>
                        
                        </Animated.View>
}
                            
                            <View>
                                
                                <View style={{flexDirection: "row"}}>
                                    
                                    <TextInput
                                        placeholder="End"
                                        
                                        onFocus={() =>
                                            this.setState({
                                                dateModalVisible: true,
                                            })
                                        }
                                        value={
                                            this.state.validDateSelected
                                                ? this.state.date.toDateString()
                                                : null
                                        }
                                        showError={
                                            this.state.submitPressed
                                                ? !this.state.date
                                                : false
                                        }
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
                                
                            </View>

                            
                            {/* <DatePicker 
                                mode="datetime"
                                minuteInterval={15}
                                locale="en_GB"
                            /> */}
                            {/** TIME SLOTS
                             * TODO - separate into 'to' and 'from'
                             * BOTH FOR slots and for time
                             *
                             */}
                            <FlatList
                                data={this.state.slots}
                                renderItem={({item, index}) => (
                                   
                                        <View>
                                            {index == 0 ? 
                                             <SemiBoldText
                                             style={{
                                                 fontSize: 15,
                                             }}>
                                             Slot Time(s)
                                           
                                             
                                         </SemiBoldText>
                                            : 
                                            null
                                            }
                                       
                                    
                                    <View
                                        key={index}
                                        style={{flexDirection: "row"}}>
                                        <View style={{width: 0.5 * FORM_WIDTH, alignItems:"center"}}>
                                            <TextInput
                                            style={{width:0.25*FORM_WIDTH}}
                                                placeholder="From"
                                                name={index.toString()}
                                                onChange={this.onChangeText}
                                            />
                                        </View>

                                        <View style={{width: 0.5 * FORM_WIDTH, alignItems:"center"}}>
                                            
                                            <TextInput
                                            style={{width:0.25*FORM_WIDTH}}
                                                placeholder="To"
                                                name={index.toString()}
                                                onChange={this.onChangeText}
                                            />
                                        </View>
                                        {/** only show delete icon if it's not the first slot */}
                                        {index > 0 ? (
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
                                            // borderColor: "grey",
                                            // backgroundColor: "grey",
                                            // borderWidth: 1,
                                        }}
                                        source={require("../assets/images/general-logos/photo-plus.png")}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <SemiBoldText style={{fontSize: 15}}>
                                    Address
                                </SemiBoldText>
                                <TextInput
                                    inputRef={ref => (this.address = ref)}
                                    style={{marginTop: 0, fontSize: 13}}
                                    placeholder={
                                        "Please leave this blank if you will be sending this via email once a volunteer has confirmed"
                                    }
                                    onChange={this.onChangeText}
                                    multiline
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
                            />
                            <View>
                                <SemiBoldText style={{fontSize: 15}}>
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
                        <GradientButton title="Next" onPress={this.submit} />
                    </View>
                </View>
            </View>
        );
    }
}
