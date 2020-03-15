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

/**
 * Send an authentication result. This will only include
 * and always include userId and authToken.
 * @param {object} result
 * @param {object} httpResponse
 * @return {object} authResult
 */
const sendAuthResult = (result, httpResponse) => {
    return httpResponse.status(result.status)
        .send({
            message: result.message,
            userId: result.userId,
            authToken: result.authToken,
        });
};

const sendGenericError = (error, httpResponse) => httpResponse.status(500).send({message: error.message});

const sendBuiltInError = (httpError, httpResponse) => httpResponse.status(httpError.status).send({message: httpError.message});

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
    sendAuthResult,
    sendGenericError,
    sendBuiltInError,
    sendErrorWithRedirect,
    sendBuiltInErrorWithRedirect,
};
