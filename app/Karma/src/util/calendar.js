import RNCalendarEvents from "react-native-calendar-events";

export const getCalendarPerms = async () => {
    let authStatus = await RNCalendarEvents.authorizationStatus();
    return authStatus;
};

export const askCalendarPerms = async () => {
    await RNCalendarEvents.authorizeEventStore();
};
