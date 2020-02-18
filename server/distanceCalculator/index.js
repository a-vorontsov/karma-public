/**
 * @param {float} lat1 Latitude of point 1
 * @param {float} lon1 Longitude of point 1
 * @param {float} lat2 Latitude of point 2
 * @param {float} lon2 Longitude of point 2
 * @param {char} unit the unit you desire for results; M, K OR N
 * @return {float} distance between the two points
 */
const getDistance = (lat1, lon1, lat2, lon2, unit) => {
    if ((lat1 == lat2) && (lon1 == lon2)) return 0;
    const radlat1 = Math.PI * lat1 / 180;
    const radlat2 = Math.PI * lat2 / 180;
    const theta = lon1 - lon2;
    const radtheta = Math.PI * theta / 180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) dist = 1;
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
        dist = dist * 1.609344;
    }
    if (unit == "N") {
        dist = dist * 0.8684;
    }
    return dist;
};
module.exports = {
    getDistance: getDistance,
};
