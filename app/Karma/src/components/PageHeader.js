import React from 'react';
import { StyleSheet, View, Picker, Dimensions, TouchableOpacity, Image} from 'react-native';
import { RegularText} from "../components/text";

const { width, height } = Dimensions.get("window")
const formWidth = 0.8 * width;

const PageHeader = props => (
    <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 70, alignItems: 'flex-start', width: formWidth }}>
    <View style={styles.header}>
        <TouchableOpacity
        onPress={props.onPress}>
            <Image 
                style={{
                    flex: 1,
                    width: 30,
                    height: 30,
                    resizeMode: 'contain'
                }}
                source = {require('../assets/images/general-logos/back-arrow.png')}/>
        </TouchableOpacity>
        <RegularText style={{fontSize: 25, color: 'black', paddingLeft: 20}}>About</RegularText>
        </View>
    </View>
  );
  
  export default PageHeader;

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
    }
  })
