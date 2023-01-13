var ErrorResponse = require('../utils/ErrorResponse')
var notify = require('./../configs/notify');

const errorHandler = (err, req, res, next) => {
    let error = {...err}
    if(err.name === "CastError"){
        let message = notify.ERROR_CASTERROR;
        error = new ErrorResponse(404,message);
    }

    res.status(error.statusCode || 500).json({
        success : false,
        message : error.message || "SEVER ERROR"
    })
}

module.exports = errorHandler;