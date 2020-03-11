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

const sendGenericError = (error, httpResponse) => httpResponse.status(500).send({message: error.message});

const sendBuiltInError = (httpError) => httpResponse.status(httpError.status).send({message: httpError.message});

const sendErrorWithRedirect = (status, message, httpResponse) => {
    httpResponse.redirect("/error/?status=" + status + "&message=" + message);
};

/**
 * Send a built in error with redirection
 * @param {object} httpError a built in http error object in util/httpErrors
 * @param {object} httpResponse
 */
const sendBuiltInErrorWithRedirect = (httpError, httpResponse) => {
    sendErrorWithRedirect(httpError.status, httpError.message, httpResponse);
};

module.exports = {
    sendValidationErrors,
    sendResult,
    sendGenericError,
    sendBuiltInError,
    sendErrorWithRedirect,
    sendBuiltInErrorWithRedirect,
};
