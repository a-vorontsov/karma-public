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

/**
 * Geocode given address, i.e. geographically locate
 * the position and return most likely result.
 * The more precise the address description, the higher
 * chance of successful geolocation.
 * @param {Object} address
 */
const geocode = async (address) => {
    if (process.env.SKIP_GEOCODING == true) {
        return null;
    }
    try {
        return (await geocoder.geocode(
            (address.address1 !== undefined ? address.address1 : address.addressLine1) + " " +
            (address.address2 !== undefined ? address.address2 : address.addressLine2) + " " +
            (address.postcode !== undefined ? address.postcode : address.postCode) + " " +
            (address.city !== undefined ? address.city : address.townCity) + " " +
            (address.region !== undefined ? address.region : address.countryState)))[0];
    } catch (error) {
        log.error("Geocoding error: " + error);
        return null;
    }
};

module.exports = {
    geocode,
};
