"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listener = void 0;
var Listener = /** @class */ (function () {
    function Listener(client) {
        this.ackWait = 5 * 1000; // 'protected' : subcalss able to define if like
        this.client = client;
    }
    Listener.prototype.subscriptionOptions = function () {
        return (this.client
            .subscriptionOptions()
            .setManualAckMode(true)
            // 'true' To ack manually after the event properly processed rather than auto-immediatedly as soons as receiving
            // But this for this manual ACK,
            // Unless ack'ed manually, NATS will re-send the event after 30 minutes to the group queue listener(s)
            .setDeliverAllAvailable()
            // Redeliver all events from the beginning
            .setDurableName(this.queueGroupName)
            // Record the tracking of durable susbripton 'accounting-service'
            // working along queue group name below 'orders-service-queue-group'
            .setAckWait(this.ackWait)
        // to customise rather than 30sec default.
        );
    };
    Listener.prototype.parseMessage = function (msg) {
        var data = msg.getData();
        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8')); // if buffer
    };
    Listener.prototype.listen = function () {
        var _this = this;
        var subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subscription.on('message', function (msg) {
            console.log("Message received: " + _this.subject + " / " + _this.queueGroupName);
            var parsedData = _this.parseMessage(msg);
            _this.onMessage(parsedData, msg);
        });
    };
    return Listener;
}());
exports.Listener = Listener;
