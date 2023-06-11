/**
 * sendResponse : It sends the success response on triggering the api
 * @param {response message} _message 
 * @param {response data} _data 
 * @returns success response
 */
const sendResponse = (_message, _data) => {
    const response = {
        success: true,
        message: _message,
        data: _data
    };
    return response;
};

/**
 * sendError : It sends the failure response on triggering the api
 * @param {response message} _message 
 * @param {response data} _data 
 * @returns failure response
 */
const sendError = (_message, _data) => {
    const response = {
        success: false,
        message: _message,
        data: _data
    };
    return response;
};

module.exports={sendResponse,sendError};




