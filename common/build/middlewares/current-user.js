"use strict";
// This middleware is only to extract the user payload from jwt token
// Business logic against authentication will be done by next middleware
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.currentUser = function (req, res, next) {
    if (!req.session || !req.session.jwt) {
        return next();
    }
    try {
        var payload = jsonwebtoken_1.default.verify(req.session.jwt, process.env.JWT_KEY);
        req.currentUser = payload;
    }
    catch (err) { }
    next();
};
