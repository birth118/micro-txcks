"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = void 0;
var OrderStatus;
(function (OrderStatus) {
    // Order created but ticket is not reserved yet momentarily
    OrderStatus["Created"] = "created";
    // Order is trying to revserve the ticket which is already reserved by other other
    // Or, the user cancelled the order
    // Or, ther order expires before payment
    OrderStatus["Cancelled"] = "cancelled";
    // Order is waiting payment
    OrderStatus["AwaitingPayment"] = "awaiting:payment";
    // Order was paid
    OrderStatus["Complete"] = "complete";
})(OrderStatus = exports.OrderStatus || (exports.OrderStatus = {}));
