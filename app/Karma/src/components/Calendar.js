import React, {Component} from "react";
import {StyleSheet, View, Dimensions} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import Colours from "../styles/Colours";

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const formWidth = 0.8 * SCREEN_WIDTH;

export default class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: null,
            selectedEndDate: null,
        };
        this.onDateChange = this.onDateChange.bind(this);
    }

    onDateChange(date, type) {
        if (type === "END_DATE") {
            this.setState({
                selectedEndDate: date,
            });
        } else {
            this.setState({
                selectedStartDate: date,
                selectedEndDate: null,
            });
        }
    }

    render() {
        const minDate = new Date(); // Today
        const maxDate = new Date(2020, 6, 3);

        return (
            <View style={styles.container}>
                <CalendarPicker
                    startFromMonday={true}
                    allowRangeSelection={true}
                    minDate={minDate}
                    maxDate={maxDate}
                    todayBackgroundColor={Colours.grey}
                    selectedDayColor={Colours.blue}
                    selectedDayTextColor="#FFFFFF"
                    onDateChange={this.onDateChange}
                    width={formWidth}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
    },
});

// https://reactnativeexample.com/a-calendar-picker-component-for-react-native/
