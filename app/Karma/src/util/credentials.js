import AsyncStorage from "@react-native-community/async-storage";

export const getAuthToken = async () => {
    try {
        const authToken = await AsyncStorage.getItem("ACCESS_TOKEN");
        if (authToken) {
            return authToken;
        } else {
            return "";
        }
    } catch (error) {
        console.log("Token couldn't be accessed!", error);
    }
};
