const distanceCalculator = require('../distanceCalculator');

const sortByTime = (events) => {
    events.sort((event1, event2) => {
        const date1 = new Date(event1.date);
        const date2 = new Date(event2.date);
        if (date1 > date2) return 1;
        else if (date1 < date2) return -1;
        else return 0;
    });
    return events;
};

const sortByDistanceFromUser = (events, user) => {
    if (events.length === 1) {
        // to display distance when only one event is fetched
        events[0].distance = distanceCalculator.getDistance(user, events[0], 'M');
    }
    events.sort((event1, event2) => {
        event1.distance = distanceCalculator.getDistance(user, event1, 'M');
        event2.distance = distanceCalculator.getDistance(user, event2, 'M');
        if (event1.distance > event2.distance) return 1;
        else if (event1.distance < event2.distance) return -1;
        else return 0;
    });
    return events;
};

const sortByTimeAndDistance = (events, user) => {
    return sortByDistanceFromUser(sortByTime(events), user);
};

const groupBy = key => array =>
    array.reduce(
        (objectsByKeyValue, obj) => ({
            ...objectsByKeyValue,
            [obj[key]]: (objectsByKeyValue[obj[key]] || []).concat(obj),
        }), {},
    );
const groupByCause = groupBy('causeName');

module.exports = {
    sortByTime,
    sortByDistanceFromUser,
    groupByCause,
    sortByTimeAndDistance,
};
