import React from "react";

import {
    View,
    Text,
} from "react-native";

import Carousel, { Pagination } from 'react-native-snap-carousel';

import { SignupCard } from "../components/signup";
import { Button, TransparentButton } from "../components/buttons";

import Styles from "../styles/Styles";
import CarouselStyles, { itemWidth, sliderWidth } from "../styles/CarouselStyles";

const carouselEntries = [
    { individual: true },
    { individual: false },
]

export default class InitSignupScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0
        };
    }
    _renderItem = ({ item }) => {
        return (
            <View style={CarouselStyles.itemContainer}>
                <View style={[CarouselStyles.item, CarouselStyles.shadow]}>
                        <SignupCard individual={item.individual}/>
                </View>
            </View>
        );
    }
    render() {
        return (
            <View>
                <View style={Styles.container}>
                    <Text>Welcome to Karma</Text>
                    <Text>This is some text that goes under the header</Text>
                </View>
                <Carousel
                    ref={c => { this._carousel = c; }}
                    data={carouselEntries}
                    renderItem={this._renderItem}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    inactiveSlideOpacity={1}
                    inactiveSlideScale={1}
                    containerCustomStyle={CarouselStyles.slider}
                    onSnapToItem={(index) => this.setState({ activeSlide: index }) } />
                <Pagination
                    dotsLength={carouselEntries.length}
                    activeDotIndex={this.state.activeSlide}
                    dotStyle={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: "#01a7a6",
                    }}
                    inactiveDotStyle={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderColor: "#01a7a6",
                        borderWidth: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0)'
                    }}
                    inactiveDotOpacity={1}
                    inactiveDotScale={0.8} />
                <View style={Styles.container}>
                    <Text>Already on Karma?</Text>
                    <TransparentButton title="Log in"/>
                </View>
            </View>
        );
    }
};
