/**
 * Error Handler Function
 * This function creates a new error object with a custom status code and message.
 *
 * @param {number} statusCode - The HTTP status code to assign to the error.
 * @param {string} message - The error message to assign to the error.
 * @returns {Error} The customized error object.
 */

const errorHandler = (statusCode,  message) => { 
    const error = new Error(message); 
    error.statusCode = statusCode;
    return error;
}
module.exports = errorHandler;
 