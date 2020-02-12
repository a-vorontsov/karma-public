import React from 'react';
import { View, Text, Image, Alert, StyleSheet, Dimensions, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import DatePicker from '../components/DatePicker';
import PhotoUpload from 'react-native-photo-upload';

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
        };
    }

    static navigationOptions = {
        headerShown: false
    }

    goToPrevious(){
        this.props.navigation.navigate('SignUpScreen')
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
          });
        } else if (!this.state.genderSelected && this.state.birthYearSelected) {
          this.setState({
            genderSelected: false,
          });
        } else {
          this.setState({
            genderSelected: false,
            birthYearSelected: false
          });
        }

        {!this.state.genderSelected && (
            Alert.alert('Error','Please select a gender.')
          )}
    
        {!this.state.birthYearSelected && (
            alert('Please select a valid birthday.')
        )}
      }

    setGender(selectedGender) {
        this.setState ({
            gender: selectedGender,
            genderSelected: true
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
                    <TouchableOpacity
                    onPress={() => this.goToPrevious()}>
                        {/* arrow button */}
                    </TouchableOpacity>
                    <Text style={styles.headerText}>About</Text>
                </View>
                <Text style={styles.subheaderText}>Tell us about yourself</Text>
                <Text style={styles.subText}>Charities need to know this information about volunteers.</Text>
            </View>

            {/* PHOTO UPLOAD */}
            <View style={styles.header}>
            <PhotoUpload
                onPhotoSelect={avatar => {
                    if (avatar) {
                        console.log('Image base64 string: ', avatar)
                        var photo = {
                            uri: avatar,
                            type: 'image/jpeg',
                            name: 'profile.jpg',
                        };
                        
                        var body = new FormData();
                        body.append('authToken', 'secret');
                        body.append('photo', photo);
                        
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', serverURL);
                        xhr.send(body);
                    }
                }}
                >
                <Image
                    style={{
                    paddingVertical: 10,
                    width: 50,
                    height: 50,
                    borderRadius: 75
                    }}
                    resizeMode='cover'
                    source={require('../assets/color.png')}
                />
            </PhotoUpload>
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
                style={[this.state.gender == "Male" ? styles.genderButtonSelected : styles.genderButton]}
                onPress={() => this.setGender("Male")}
              >
                <Text style={[this.state.gender == "Male" ? styles.buttonTextSelected : styles.buttonText]}
                >Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[this.state.gender == "Female" ? styles.genderButtonSelected : styles.genderButton]}
                onPress={() => this.setGender("Female")}
              >
                <Text style={[this.state.gender == "Female" ? styles.buttonTextSelected : styles.buttonText]}
                >Female
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[this.state.gender == "Non-Binary" ? styles.genderButtonSelected : styles.genderButton]}
                onPress={() => this.setGender("Non-Binary")}
              >
                <Text style={[this.state.gender == "Non-Binary" ? styles.buttonTextSelected : styles.buttonText]}
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
    buttonTextSelected: {
        fontSize: 15,
        fontWeight: '400',
        color: 'white',
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
    genderButtonSelected: {
        height: 40,
        width: 150,
        backgroundColor: "#00A8A6",
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