<<<<<<< HEAD
<<<<<<< HEAD
import React from "react";
import {View, TouchableOpacity, Image} from "react-native";
import {RegularText} from "../components/text";
import { useNavigation } from "react-navigation-hooks";
import Colours from "../styles/Colours";

const PageHeader = props => {
    const navigation = useNavigation();
    const {title} = props;
    return (
        <View>
            <View style={{paddingTop: 24}} />
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        style={{
                            flex: 1,
                            width: 24,
                            height: 24,
                            resizeMode: "contain",
                        }}
                        source={require("../assets/images/general-logos/back-arrow.png")}
                    />
                </TouchableOpacity>
                <RegularText
                    style={{
                        fontSize: 24,
                        fontWeight: "600",
                        color: Colours.darkGrey,
                        paddingLeft: 16,
                    }}>
                    {title}
                </RegularText>
            </View>
        </View>
    );
};

export default PageHeader;
=======
<<<<<<< HEAD
import React from 'react';
import { View, SafeAreaView, Dimensions, TouchableOpacity, Image} from 'react-native';
import { RegularText} from "../components/text";
import Styles from "../styles/Styles";
=======
=======
>>>>>>> Create Profile Edit page with all buttons, sliders, switches
import React from "react";
import {View, TouchableOpacity, Image} from "react-native";
import {RegularText} from "../components/text";
import { useNavigation } from "react-navigation-hooks";

const PageHeader = props => {
    const navigation = useNavigation();
    const {title} = props;
    return (
        <View>
            <View style={{paddingTop: 24}} />
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        style={{
<<<<<<< HEAD
                            fontSize: 30,
                            fontWeight: "500",
                            color: "#3E3E3E",
                            paddingLeft: 20,
                        }}>
                        {this.props.title}
                    </RegularText>
                </View>
            </SafeAreaView>
        );
    }
}
>>>>>>> Fix carousel and improve activity card
=======
                            flex: 1,
                            width: 24,
                            height: 24,
                            resizeMode: "contain",
                        }}
                        source={require("../assets/images/general-logos/back-arrow.png")}
                    />
                </TouchableOpacity>
                <RegularText
                    style={{
                        fontSize: 24,
                        fontWeight: "600",
                        color: "grey",
                        paddingLeft: 16,
                    }}>
                    {title}
                </RegularText>
            </View>
        </View>
    );
};

export default PageHeader;
>>>>>>> Create Profile Edit page with all buttons, sliders, switches
