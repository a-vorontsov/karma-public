import AsyncStorage from "@react-native-community/async-storage";

export const getAuthToken = async () => {
    try {
        const authToken = await AsyncStorage.getItem("t");
        if (authToken) {
            return authToken;
        } else {
            console.log("No token stored");
        }
    } catch (error) {
        console.log("Token couldn't be accessed!", error);
    }
};
