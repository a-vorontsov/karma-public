import React from "react";
import {View, Image, TouchableOpacity, Dimensions} from "react-native";
import Modal, {ModalContent, SlideAnimation} from "react-native-modals";
const cross = require("../assets/images/general-logos/cross.png");
const {height: SCREEN_HEIGHT} = Dimensions.get("window");

export default class BottomModal extends React.Component {
    constructor(props) {
        super(props);
        const visible = props.visible !== null ? props.visible : true;
        this.state = {
            visible,
        };
        this.close = this.close.bind(this);
    }
    close() {
        this.setState({visible: false});
    }
    render() {
        const {visible} = this.state;
        return (
            <Modal.BottomModal
                visible={visible}
                onDismiss={() => this.close()}
                onTouchOutside={() => this.close()}
                swipeDirection="down"
                onSwipeOut={() => this.close()}
                onHardwareBackPress={() => {
                    this.close();
                    return true;
                }}
                modalStyle={{maxHeight: SCREEN_HEIGHT * 0.9}}
                modalAnimation={new SlideAnimation({slideFrom: "bottom"})}>
                <ModalContent>
                    <View>
                        <View style={{alignSelf: "flex-end"}}>
                            <TouchableOpacity
                                onPress={() => this.close()}
                                activeOpacity={0.9}>
                                <Image
                                    source={cross}
                                    style={{height: 24}}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                        {this.props.children}
                    </View>
                </ModalContent>
            </Modal.BottomModal>
        );
    }
}
