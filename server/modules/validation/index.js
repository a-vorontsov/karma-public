const Validator = require('jsonschema').Validator;
const validator = new Validator();


/**
 * If a validation fails, the return value of the validator has a property error
 * which consists of ValidationErrors like the following example:
 * errors: [
 ValidationError {
          property: 'instance.lat',
          message: 'must have a maximum value of 90',
          schema: [Object],
          instance: 251.523774,
          name: 'maximum',
          argument: 90,
          stack: 'instance.lat must have a maximum value of 90'
        }
 ],
 */

/**
 * Custom validation errors (from our project semantics) can be added by pushing properly initialized
 * new ValidationError()-s onto the errors array.
 */

const addressSchema = {
    "id": "/Address",
    "type": "object",
    "properties": {
        "id": {"type": "number"},
        "address_1": {"type": "string"},
        "address_2": {"type": "string"},
        "postcode": {"type": "string"},
        "city": {"type": "string"},
        "region": {"type": "string"},
        "lat": {"type": "number", "minimum": -90, "maximum": 90},
        "long": {"type": "number", "minimum": -180, "maximum": 180},
    },
    "required": ["address_1", "address_2", "postcode", "city", "region", "lat", "long"],
};

const eventSchema = {
    "id": "/Event",
    "type": "object",
    "properties": {
        "id": {"type": "number"},
        "name": {"type": "string"},
        "address_id": {"type": "number"},
        "women_only": {"type": "boolean"},
        "spots": {"type": "number", "minimum": 0},
        "address_visible": {"type": "boolean"},
        "minimum_age": {"type": "number", "minimum": 0},
        "photo_id": {"type": "boolean"},
        "physical": {"type": "boolean"},
        "add_info": {"type": "boolean"},
        "content": {"type": "string"},
        "date": {"type": ["string", "date-time"]}, // allow both strings and Dates
        "user_id": {"type": "number"},
        "creation_date": {"type": ["string", "date-time"]},
        "address": {"$ref": "/Address"},
    },
    "required": ["name", "women_only", "spots", "address_visible", "minimum_age", "photo_id",
        "physical", "add_info", "content", "date", "user_id", "creation_date"],
};

validator.addSchema(addressSchema, "/Address");
validator.addSchema(eventSchema, "/Event");

const validateAddress = (address) => {
    return validator.validate(address, addressSchema);
};

const validateEvent = (event) => {
    console.log(validator);
    return validator.validate(event, eventSchema);
};

module.exports = {
    validateAddress: validateAddress,
    validateEvent: validateEvent,
};
