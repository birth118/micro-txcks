"use strict";
// Q: How to make subclasses (i,e, RequestValidationError or DatabaseConnectionError)
//    more robust by avoiding runtime errors such as typo error, possble inconsistency, ..
// A: Option #1 to use interface to complying properties
//    Option #2 to use abstract class to shape out the exact sinature of each subclass
//        As-Is : Error (built-in)  --> RequestValidationError or DatabaseConnectionError
//        To-Be:  Error (built-in) --> abstract --> RequestValidationError or DatabaseConnectionError
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
exports.CustomError = void 0;
/* Option #1: interface

interface CustomErrorInterface {
  statusCode: number
  serializeErrors(): {
    message: string
    field?: string
  }[]
}
*/
//Option #2: Check how simialr signature to interface
var CustomError = /** @class */ (function (_super) {
    __extends(CustomError, _super);
    function CustomError(message) {
        var _this = _super.call(this, message) || this;
        // Only because we extends built-in class
        Object.setPrototypeOf(_this, CustomError.prototype);
        return _this;
    }
    return CustomError;
}(Error));
exports.CustomError = CustomError;
