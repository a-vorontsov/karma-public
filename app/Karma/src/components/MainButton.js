import React from 'react';
import { TouchableOpacity } from 'react-native';

const MainButton = props => (
  <TouchableOpacity
    style={{
      width: 30,
      height: 50,
      borderRadius: 10,
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: props.buttonColor

    }}
    onPress={props.onPress}
    hitSlop={{
      top: 15,
      bottom: 15,
      left: 15,
      right: 0,
    }}
  >

    <Text
      style={{
        color: props.textColor,
        fontSize: 17,
        fontWeight: 'bold',
        fontFamily: 'Circular-Std-Bold',
      }}
    >
      {props.buttonText}
    </Text>
  </TouchableOpacity>
  
);

export default MainButton;