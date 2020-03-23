const log = require("../../util/log");
const NodeGeocoder = require('node-geocoder');
const options = {
    provider: 'mapquest',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: process.env.MAPQUEST_API, // for Mapquest, OpenCage, Google Premier
    formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

const geocode = async (address) => {
    if (process.env.SKIP_GEOCODING == true) {
        return null;
    }
    try {
        return await geocoder.geocode(
            address.addressLine1 + " " +
            address.addressLine2 + " " +
            address.postCode + " " +
            address.townCity + " " +
            address.countryState);
    } catch (error) {
        log.error("Geocoding error: " + error);
        return null;
    }
};

module.exports = {
    geocode,
};
