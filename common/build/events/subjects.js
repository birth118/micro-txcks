"use strict";
// These will enforce to use S'ubjects.TicketCreated  instead of typo-prone 'ticket:created'
// Otherwise, Miki perhaps will use 'Ticket:Created' instead of 'ticket:created'
// This is all the way to prevent to use plain string 'ticket:created' because it is type-prone
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subjects = void 0;
var Subjects;
(function (Subjects) {
    Subjects["TicketCreated"] = "ticket:created";
    Subjects["TicketUpdated"] = "ticket:updated";
    Subjects["OrderCreated"] = "order:created";
    Subjects["OrderCancelled"] = "order:cancelled";
    Subjects["ExpirationComplete"] = "expiration:complete";
    Subjects["PaymentCreated"] = "payment:created";
})(Subjects = exports.Subjects || (exports.Subjects = {}));
// Test code
// const printSubject = (Subject: Subjects) => {}
// printSubject(Subjects.TicketCreated)
