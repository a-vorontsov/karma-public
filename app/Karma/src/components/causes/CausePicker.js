import React from "react";
import CauseItem from "./CauseItem";
import CauseStyles from "../../styles/CauseStyles";
import {View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";

export default class CausePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
        };
        this.onPress = this.onPress.bind(this);
    }
    onPress(item) {
        const newItems = this.state.items;
        const ids = [...newItems.map(cause => cause.id)];
        const index = ids.indexOf(item.id);
        if (index === -1) {
            newItems.push(item);
        } else {
            newItems.splice(index, 1);
        }
        this.setState({
            items: newItems,
        });
        this.props.onChange(this.state.items);
    }
    render() {
        const {causes} = this.props;
        const {items} = this.state;

        return (
            <View
                style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    overflow: "visible",
                }}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={CauseStyles.container}>
                        {causes.map(c => {
                            const selected = items.some(
                                item => item.id === c.id,
                            );
                            return (
                                <CauseItem
                                    key={c.id}
                                    cause={c}
                                    selected={selected}
                                    display={false}
                                    onPress={this.onPress}
                                />
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
