import React from 'react';
import { View, Text, Image, Alert, StyleSheet, Dimensions, Platform, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import { ScrollView } from "react-native-gesture-handler";
import DatePicker from 'react-native-date-picker'
import PhotoUpload from 'react-native-photo-upload';
import { RegularText, TitleText, SemiBoldText, LogoText } from "../components/text";

const { width, height } = Dimensions.get("window")
const formWidth = 0.8 * width;

class AboutScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photo: null,
            gender: null,
            genderSelected: false,
            dateSelected: false,
            date: new Date(),
            minYear: new Date().getFullYear()-18
        };
    }

    static navigationOptions = {
        headerShown: false
    }

    goToPrevious(){
        this.props.navigation.navigate('SignUpScreen')
    }

    goToNext() {
        if (this.state.genderSelected && this.state.dateSelected) {
          this.props.navigation.navigate('ContactInfoScreen', {
            photo: this.state.photo,
            gender: this.state.gender,
            date: this.state.date
          });
        } else if (this.state.genderSelected && !this.state.dateSelected) {
          this.setState({
            dateSelected: false,
          });
        } else if (!this.state.genderSelected && this.state.dateSelected) {
          this.setState({
            genderSelected: false,
          });
        } else {
          this.setState({
            genderSelected: false,
            dateSelected: false
          });
        }

        {!this.state.genderSelected && (
            Alert.alert('Error','Please select a gender.')
          )}
    
        {!this.state.dateSelected && (
            Alert.alert('Error','Please select a valid birthday. You must be 18 years or older to use Karma.')
        )}
      }

    setGender(selectedGender) {
        this.setState ({
            gender: selectedGender,
            genderSelected: true
        });
    }

    setPhoto(selectedPhoto) {
        this.setState ({
            photo: selectedPhoto,
        });
    }

    uploadPhoto(selectedPhoto) {
        if (selectedPhoto != null){
            Alert.alert('Success!','Your new photo has been uploaded.')
        } else (
            Alert.alert('Error','Please upload a photo.')
        )
    }

    setDate(selectedDate) {
        this.setState({ date: selectedDate });
        if (selectedDate.getFullYear() <= this.state.minYear){
            this.setState ({
                dateSelected: true
            });
        } else {
            this.setState ({
                dateSelected: false
            });
        }
    }

    setPhoto(selectedPhoto) {
        this.setState ({
            photo: selectedPhoto,
        });
    }

    uploadPhoto(selectedPhoto) {
        if (selectedPhoto != null){
            Alert.alert('Success!','Your new photo has been uploaded.')
        } else (
            Alert.alert('Error','Please upload a photo.')
        )
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
                        <Image 
                            style={{
                                flex: 1,
                                width: 30,
                                height: 30,
                                resizeMode: 'contain'
                            }}
                            source = {require('../assets/images/general-logos/back-arrow.png')}/>
                    </TouchableOpacity>
                    <RegularText style={styles.headerText}>About</RegularText>
                </View>
                <RegularText style={styles.subheaderText}>Tell us about yourself</RegularText>
                <RegularText style={styles.subText}>Charities need to know this information about volunteers.</RegularText>
            </View>

            {/* PHOTO UPLOAD */}
            <View style={styles.header}>
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
                    paddingVertical: 10,
                    width: 50,
                    height: 50,
                    borderRadius: 75
                    }}
                    resizeMode='cover'
                    source={require('../assets/images/general-logos/photo-logo.png')}
                />
            </PhotoUpload>
                <TouchableOpacity
                    style={styles.uploadButton}
                    onPress={() => this.uploadPhoto(this.state.photo)}
                    >
                    <RegularText style={styles.buttonText, {fontSize: 20, color: 'gray'}}>Upload Photo</RegularText>
                </TouchableOpacity> 
            </View>
            {/* BIRTHDAY SELECTION */}
            <RegularText style={styles.smallHeaderText}>When is your birthday?</RegularText>
            <DatePicker
                fadeToColor = 'none'
                mode='date'
                date={this.state.date}
                onDateChange={date => this.setDate(date)}
            />

            {/* GENDER SELECTION */}
            <RegularText style={styles.smallHeaderText}>
                Choose your gender
            </RegularText>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[this.state.gender == "Male" ? styles.genderButtonSelected : styles.genderButton]}
                onPress={() => this.setGender("Male")}
              >
                <RegularText style={[this.state.gender == "Male" ? styles.buttonTextSelected : styles.buttonText]}
                >Male
                </RegularText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[this.state.gender == "Female" ? styles.genderButtonSelected : styles.genderButton]}
                onPress={() => this.setGender("Female")}
              >
                <RegularText style={[this.state.gender == "Female" ? styles.buttonTextSelected : styles.buttonText]}
                >Female
                </RegularText>
              </TouchableOpacity>
            </View>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[this.state.gender == "Non-Binary" ? styles.genderButtonSelected : styles.genderButton]}
                onPress={() => this.setGender("Non-Binary")}
              >
                <RegularText style={[this.state.gender == "Non-Binary" ? styles.buttonTextSelected : styles.buttonText]}
                >Non-Binary
                </RegularText>
              </TouchableOpacity>
            </View>

            {/* FORM SUBMISSION */}
            <TouchableOpacity
                style={styles.nextButton}
                onPress={() => this.goToNext()}  >
                <RegularText style={styles.buttonText, {color: 'white', fontSize: 20}}>Next</RegularText>
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
        fontSize: 25,
        color: 'black',
        paddingLeft: 20
    },
    subheaderText: {
        fontSize: 25,
        textAlignVertical: 'top',
        textAlign: 'left',
        paddingTop: 20,
        paddingBottom: 20,
        color: '#00A8A6'
    },
    smallHeaderText: {
        fontSize: 20,
        textAlignVertical: 'top',
        textAlign: 'left',
        paddingTop: 20,
        paddingBottom: 10,
        color: '#00A8A6'
    },
    subText: {
        fontSize: 15,
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
// https://www.npmjs.com/package/react-native-photo-upload