"use strict";

exports.responseFormat = function (status = true, data = {}, errors = {}, msg = '') {

    return {
        "success": status,
        "data": data,
        "errors": errors,
        "message": msg
    };

};


