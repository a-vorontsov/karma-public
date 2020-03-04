import React from "react";

import {View} from "react-native";
import Carousel, {Pagination} from "react-native-snap-carousel";
import {SafeAreaView} from "react-native-safe-area-context";

import {SignupCard} from "../components/signup";
import {TransparentButton} from "../components/buttons";
import {
    RegularText,
    TitleText,
    SemiBoldText,
    LogoText,
} from "../components/text";

import Styles from "../styles/Styles";
import CarouselStyles, {itemWidth, sliderWidth} from "../styles/CarouselStyles";
import Colours from "../styles/Colours";

const carouselEntries = [{individual: true}, {individual: false}];

export default class InitSignupScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSlide: 0,
        };
    }
    _renderItem = ({item}) => {
        return (
            <View style={CarouselStyles.itemContainer}>
                <View style={[CarouselStyles.item, CarouselStyles.shadow]}>
                    <SignupCard individual={item.individual} />
                </View>
            </View>
        );
    };
    render() {
        const {navigate} = this.props.navigation;
        return (
            <SafeAreaView style={Styles.container}>
                <View style={[Styles.pt16, Styles.ph24]}>
                    <TitleText>
                        Welcome to&nbsp;
                        <LogoText style={Styles.xxlarge}>Karma</LogoText>
                    </TitleText>
                    <RegularText style={[Styles.pv16, Styles.small]}>
                        Lorem ipsum dolor sit amet, consectetur adip isicing
                        elit, sed do eiusmod.
                    </RegularText>
                </View>
                <View>
                    <Carousel
                        ref={c => {
                            this._carousel = c;
                        }}
                        data={carouselEntries}
                        removeClippedSubviews={false}
                        renderItem={this._renderItem}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        inactiveSlideOpacity={1}
                        inactiveSlideScale={1}
                        containerCustomStyle={CarouselStyles.slider}
                        onSnapToItem={index =>
                            this.setState({activeSlide: index})
                        }
                    />
                    <Pagination
                        dotsLength={carouselEntries.length}
                        containerStyle={Styles.pv8}
                        activeDotIndex={this.state.activeSlide}
                        dotStyle={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: Colours.blue,
                        }}
                        inactiveDotStyle={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderColor: Colours.blue,
                            borderWidth: 2,
                            backgroundColor: "rgba(0, 0, 0, 0)",
                        }}
                        inactiveDotOpacity={1}
                        inactiveDotScale={0.8}
                    />
                </View>
                <View style={[Styles.bottom]}>
                    <View
                        style={[
                            Styles.ph24,
                            Styles.pb24,
                            Styles.pt8,
                            Styles.bgWhite,
                        ]}>
                        <SemiBoldText style={[Styles.pv16, Styles.medium]}>
                            Already on Karma?
                        </SemiBoldText>
                        <TransparentButton title="Log in"  />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
