"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestValidationError = void 0;
var custom_error_1 = require("./custom-error");
// Q: How to make this subclasses (i,e, RequestValidationError or DatabaseConnectionError)
//    more robust by avoiding runtime errors such as typo error, possble inconsistency, ..
// A: Option #1 to use interface to complying properties
//    Option #2 to use abstract class to shape out the exact sinature of each subclass
//        As-Is : Error (built-in)  --> RequestValidationError or DatabaseConnectionError
//        To-Be:  Error (built-in) --> abstract --> RequestValidationError or DatabaseConnectionError
/* Option #1: interface

interface CustomErrorInterface {
  statusCode: number
  serializeErrors(): {
    message: string
    field?: string
  }[]
}
*/
var RequestValidationError = /** @class */ (function (_super) {
    __extends(RequestValidationError, _super);
    function RequestValidationError(err) {
        // console.log(errors)
        var _this = _super.call(this, 'Invalid Request parameters') || this;
        _this.statusCode = 400;
        _this.errors = err;
        // Only because we extends built-in class
        Object.setPrototypeOf(_this, RequestValidationError.prototype);
        return _this;
    }
    RequestValidationError.prototype.serializeErrors = function () {
        return this.errors.map(function (error) {
            return { message: error.msg, field: error.param };
        });
    };
    return RequestValidationError;
}(custom_error_1.CustomError));
exports.RequestValidationError = RequestValidationError;
