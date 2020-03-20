import * as Keychain from "react-native-keychain";

export const getData = async () => {
    try {
        // Retreive the credentials
        const credentials = await Keychain.getGenericPassword();
        const userId = credentials.username;
        if (credentials) {
            console.log(
                "Credentials successfully loaded for user " +
                    credentials.username,
            );
            return credentials;
        } else {
            console.log("No credentials stored");
        }
    } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
    }
};
