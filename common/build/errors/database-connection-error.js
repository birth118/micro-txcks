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
exports.DatabaseConnectionError = void 0;
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
var DatabaseConnectionError = /** @class */ (function (_super) {
    __extends(DatabaseConnectionError, _super);
    function DatabaseConnectionError() {
        var _this = _super.call(this, 'Database connetion error') || this;
        _this.reason = 'Error connection to Database';
        _this.statusCode = 500;
        // Only because we extends built-in class
        Object.setPrototypeOf(_this, DatabaseConnectionError.prototype);
        return _this;
    }
    DatabaseConnectionError.prototype.serializeErrors = function () {
        return [{ message: this.reason }];
    };
    return DatabaseConnectionError;
}(custom_error_1.CustomError));
exports.DatabaseConnectionError = DatabaseConnectionError;
