import React from 'react';
import { View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import DatePicker from '../components/DatePicker';

const { width, height } = Dimensions.get("window")
const formWidth = 0.8 * width;

class AboutScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photo: null,
            birthDay: (new Date()).getDate(),
            birthMonth: (new Date()).getMonth(),
            birthYear: null,
            gender: null,
            genderSelected: false,
            birthYearSelected: false,
            birthYearError: false,
            genderError: false
        };
    }

    static navigationOptions = {
        headerShown: false
    }

    goToNext() {
        if (this.state.genderSelected && this.state.birthYearSelected) {
          this.props.navigation.navigate('ContactInfoScreen', {
            gender: this.state.gender,
            birthDay: this.state.birthDay,
            birthMonth: this.state.birthMonth,
            birthYear: this.state.birthYear
          });
        } else if (this.state.genderSelected && !this.state.birthYearSelected) {
          this.setState({
            birthYearSelected: false,
            birthYearError: true,
          });
        } else if (!this.state.genderSelected && this.state.birthYearSelected) {
          this.setState({
            genderSelected: false,
            genderError: true,
          });
        } else {
          this.setState({
            genderSelected: false,
            genderError: true,
            birthYearSelected: false,
            birthYearError: true,
          });
        }
      }

    setGender(selectedGender) {
        this.setState ({
            gender: selectedGender
        });
    }

    setBirthDay(selectedDay) {
        this.setState ({
            birthDay: selectedDay
        });
    }
    
    setBirthMonth(selectedMonth) {
        this.setState ({
            birthMonth: selectedMonth
        });
    }

    setBirthYear(selectedYear) {
        this.setState ({
            birthMonth: selectedYear,
            birthYearSelected: true
        });
    }

    render() {
        return(
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
            <ScrollView showsVerticalScrollIndicator={false}>

            {/* HEADER */}
            <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 70, alignItems: 'flex-start', width: formWidth }}>
                <View style={styles.header}>
                    <TouchableOpacity>
                        {/* arrow button */}
                    </TouchableOpacity>
                    <Text style={styles.headerText}>About</Text>
                </View>
                <Text style={styles.subheaderText}>Tell us about yourself</Text>
                <Text style={styles.subText}>Charities need to know this information about volunteers.</Text>
            </View>

            {/* PHOTO UPLOAD */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Text style={{color:'gray', paddingRight: 110}}>pic</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadButton}>
                    <Text style={styles.buttonText, {fontSize: 20, color: 'gray'}}>Upload Photo</Text>
                </TouchableOpacity>
            </View>

            {/* BIRTHDAY SELECTION */}
            <Text style={styles.smallHeaderText}>When is your birthday?</Text>
            <DatePicker
                onYearValueChange={(year,i) => this.setBirthYear(year)}
                onMonthValueChange={(month,i) => this.setBirthMonth(month)}
                onDayValueChange={(day,i) => this.setBirthDay(day)}
            />

            {/* GENDER SELECTION */}
            <Text style={styles.smallHeaderText}>
                Choose your gender
            </Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton]}
                onPress={() => this.setGender("Male")}
              >
                <Text style={styles.buttonText}
                >Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton]}
                onPress={() => this.setGender("Female")}
              >
                <Text style={styles.buttonText}
                >Female
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton]}
                onPress={() => this.setGender("Non-Binary")}
              >
                <Text style={styles.buttonText}
                >Non-Binary
                </Text>
              </TouchableOpacity>
            </View>

            {/* FORM SUBMISSION */}
            <TouchableOpacity
                style={styles.nextButton}
                onPress={() => this.goToNext()}  >
                <Text style={styles.buttonText, {color: 'white', fontSize: 20}}>Next</Text>
            </TouchableOpacity>

        </ScrollView>
        </KeyboardAvoidingView>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        fontSize: 35,
        color: 'black',
        paddingLeft: 10
    },
    subheaderText: {
        fontSize: 30,
        fontFamily: 'Arial',
        textAlignVertical: 'top',
        textAlign: 'left',
        paddingTop: 20,
        paddingBottom: 20,
        color: '#00A8A6'
    },
    smallHeaderText: {
        fontSize: 20,
        fontFamily: 'Arial',
        textAlignVertical: 'top',
        textAlign: 'left',
        paddingTop: 20,
        paddingBottom: 10,
        color: '#00A8A6'
    },
    subText: {
        fontSize: 15,
        fontFamily: 'Arial',
        textAlignVertical: 'top',
        textAlign: 'left',
        paddingTop: 0,
        paddingBottom: 10,
        color: 'black'
    },
    nextButton: {
        height: 50,
        backgroundColor: '#00A8A6',
        paddingHorizontal: 30,
        paddingVertical: 15,
        marginTop: 40,
        borderRadius: 30,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    uploadButton: {
        height: 50,
        width: 200,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: '#D3D3D3',
        marginTop: 15,
        borderRadius: 30,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '400',
        color: 'gray',
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    genderButton: {
        height: 40,
        width: 150,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: '#D3D3D3',
        marginRight: 20,
        marginTop: 15,
        marginBottom: 10,
        borderRadius: 30,
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
})

export default AboutScreen


// RESOURCES:
// https://facebook.github.io/react-native/docs/cameraroll.html