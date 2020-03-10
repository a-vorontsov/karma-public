const sendValidationErrors = (validationResult, httpResponse) => {
    return httpResponse.status(400).send({
        message: "Input validation failed",
        errors: validationResult.errors,
    });
};

const sendResult = (result, httpResponse) => {
    return httpResponse.status(result.status)
        .send({message: result.message, data: result.data});
};

const sendGenericError = (error, httpResponse) => {
    return httpResponse.status(500).send({message: error.message});
};

module.exports = {
    sendValidationErrors,
    sendResult,
    sendGenericError,
};
