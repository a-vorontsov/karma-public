import React, {Component} from "react";
import {StyleSheet, View, Dimensions} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import Colours from "../styles/Colours";

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const formWidth = 0.7 * SCREEN_WIDTH;

export default class Calendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStartDate: props.startDate,
            selectedEndDate: props.endDate,
        };
        this.onDateChange = this.onDateChange.bind(this);
    }

    async onDateChange(date, type) {
        if (type === "END_DATE") {
            await this.setState({
                selectedEndDate: date,
            });
        } else {
            await this.setState({
                selectedStartDate: date,
                selectedEndDate: null,
            });
        }
        this.passUpState();
    }
    passUpState() {
        const {selectedStartDate, selectedEndDate} = this.state;
        this.props.onChange({
            selectedStartDate,
            selectedEndDate,
        });
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
                    selectedStartDate={this.state.selectedStartDate}
                    selectedEndDate={this.state.selectedEndDate}
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
        borderRadius: 5,
    },
});

// https://reactnativeexample.com/a-calendar-picker-component-for-react-native/
