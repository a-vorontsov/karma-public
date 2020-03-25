import AsyncStorage from "@react-native-community/async-storage";
import {getAuthToken} from "./credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";
const request = require("superagent");

let authToken = "";

export const getCauses = async () => {
    try {
        const response = await request
            .get(`${REACT_APP_API_URL}/causes`)
            .set("authorization", authToken);
        const causes = response.body.data;
        return causes;
    } catch (err) {
        console.log(err);
        return [];
    }
};

export const storeCauses = async () => {
    try {
        const causes = await getCauses();
        await AsyncStorage.setItem("causes", JSON.stringify(causes));
    } catch (err) {
        console.log(err);
    }
};

export const getPolicy = async () => {
    try {
        const response = await request
            .get(`${REACT_APP_API_URL}/information`)
            .set("authorization", authToken)
            .query({type: "privacyPolicy"});
        const {information} = response.body.data;
        return information.content;
    } catch (err) {
        console.log(err);
        return "";
    }
};

export const storePolicy = async () => {
    try {
        const policy = await getPolicy();
        await AsyncStorage.setItem("policy", JSON.stringify(policy));
    } catch (err) {
        console.log(err);
    }
};

export const getTerms = async () => {
    try {
        const response = await request
            .get(`${REACT_APP_API_URL}/information`)
            .set("authorization", authToken)
            .query({type: "terms"});
        const {information} = response.body.data;
        return information.content ? information.content : "";
    } catch (err) {
        console.log(err);
        return "";
    }
};

export const storeTerms = async () => {
    try {
        const terms = await getTerms();
        await AsyncStorage.setItem("terms", JSON.stringify(terms));
    } catch (err) {
        console.log(err);
    }
};

export const getAbout = async () => {
    try {
        const response = await request
            .get(`${REACT_APP_API_URL}/information`)
            .set("authorization", authToken)
            .query({type: "about"});
        const {information} = response.body.data;
        return information.content ? information.content : "";
    } catch (err) {
        console.log(err);
        return "";
    }
};

export const storeAbout = async () => {
    try {
        const about = await getAbout();
        await AsyncStorage.setItem("about", JSON.stringify(about));
    } catch (err) {
        console.log(err);
    }
};

export const initialiseApp = async () => {
    authToken = await getAuthToken();
    await storeCauses();
    await storePolicy();
    await storeTerms();
    await storeAbout();
};
