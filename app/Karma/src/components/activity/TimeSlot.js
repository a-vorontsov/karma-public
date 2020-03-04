import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import TextInput from '../TextInput';
import DatePicker from "react-native-date-picker";


export default class TimeSlot extends Component{

    constructor(props){
        super(props);
        this.state = {
            isFromVisible: false,
            isToVisible: false,
            fromDate: "",
            toDate: "",
            minToDate: new Date()
        }
    }

    setDateValue = (date, name) => {
        //set minimum date for 'to' if 'from' date is set
        if(name === "fromDate"){
            this.setState({
                minToDate: date
            })
        }
    
        //removes day and local timezone from date
        let formattedString = date.toUTCString().substring(5)
        formattedString = formattedString.slice(0, -7)
        this.setState({
            [name]: formattedString
        })

    }


    slide = (name) => {
        this.setState({
            [name]: !this.state[name]
        })
          
        };

    render(){

        return(

            <View style={[this.props.style,]}>
                <TouchableOpacity onPress={() => this.slide("isFromVisible")}>
                <View style={{flexDirection: "row"}}>
                                    
                                    <TextInput
                                       
                                        placeholder="From"
                                        pointerEvents="none"
                                        editable={false}
                                    
                                        value={this.state.fromDate}
                                    />
                                    <Image
                                        style={{
                                            position: "absolute",
                                            right: 0,
                                            top: 20,
                                            height: 20,
                                            width: 20,
                                        }}
                                        source={require("../../assets/images/general-logos/calendar-dark.png")}
                                    />
                                </View>
                                {this.state.isFromVisible &&
                                <View><DatePicker 
                                minimumDate={this.props.minFromDate}
                                mode="datetime"
                                onDateChange={(date) => this.setDateValue(date, "fromDate")}
                                locale="en_GB"
                                minuteInterval={15}
                            /></View>

                        }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.slide("isToVisible")}>
                <View style={{flexDirection: "row"}}>
                                    
                                    <TextInput
                                        placeholder="To"
                                        pointerEvents="none"
                                        editable={false}
                                        
                                        
                                        value={this.state.toDate}
                                    />
                                    <Image
                                        style={{
                                            position: "absolute",
                                            right: 0,
                                            top: 20,
                                            height: 20,
                                            width: 20,
                                        }}
                                        source={require("../../assets/images/general-logos/calendar-dark.png")}
                                    />
                                </View>
                                {this.state.isToVisible &&
                                <View><DatePicker 
                                mode="datetime"
                                onDateChange={(date) => this.setDateValue(date, "toDate")}
                                locale="en_GB"
                                minuteInterval={15}
                                minimumDate={this.state.minToDate}
                            /></View>

                        }
                </TouchableOpacity>
            </View>
        )
    }
};