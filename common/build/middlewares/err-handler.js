"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// import { RequestValidationError } from '../Errors/request-validation-error'
// import { DatabaseConnectionError } from '../Errors/database-connection-error'
var custom_error_1 = require("../errors/custom-error");
exports.errorHandler = function (err, req, res, next) {
    if (err instanceof custom_error_1.CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }
    // if (err instanceof DatabaseConnectionError) {
    //   return res.status(err.statusCode).send({ errors: err.serializeErrors() })
    // }
    // if (err instanceof RequestValidationError) {
    //   return res.status(err.statusCode).send({ errors: err.serializeErrors() })
    // }
    console.error(err);
    res.status(500).send({ errors: [{ message: 'Unknown Error' }] });
};
/*

Custom Error Structure

{
  errors:{
    message: string,
    field?: string
  }[]
}

*/
