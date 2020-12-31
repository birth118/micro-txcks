import { Stan, Message } from 'node-nats-streaming'
import { Subjects } from './subjects'

interface Event {
  subject: Subjects
  data: any
}

export abstract class Listener<T extends Event> {
  // Generic type T to utilise (extend) Event interface and will check the type of subject and data with the T
  abstract subject: T['subject']
  abstract queueGroupName: string
  abstract onMessage(data: T['data'], msg: Message): void

  protected client: Stan // 'private' : only by contruct. Cannot be accessed from subclass
  protected ackWait: number = 5 * 1000 // 'protected' : subcalss able to define if like

  constructor(client: Stan) {
    this.client = client
  }

  subscriptionOptions() {
    return (
      this.client
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
    )
  }

  parseMessage(msg: Message) {
    const data = msg.getData()
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8')) // if buffer
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    )

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`)
      const parsedData = this.parseMessage(msg)
      this.onMessage(parsedData, msg)
    })
  }
}
