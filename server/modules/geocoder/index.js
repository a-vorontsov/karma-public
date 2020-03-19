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
    return geocoder.geocode(
        address.addressLine1 + " " +
        address.addressLine2 + " " +
        address.postCode + " " +
        address.townCity + " " +
        address.countryState)
        .then(function(res) {
            return res;
        })
        .catch(function(err) {
            console.log(err);
            return null;
        });
};

module.exports = {
    geocode,
};
