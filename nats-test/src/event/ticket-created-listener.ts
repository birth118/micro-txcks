import { Listener } from '@sytickets/common'
import { Message } from 'node-nats-streaming'
import { Subjects } from '@sytickets/common'
import { TicketCreatedEvent } from '@sytickets/common'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  queueGroupName = 'payment-service'
  //  subject: Subjects.TicketCreated = Subjects.TicketCreated
  subject: TicketCreatedEvent['subject'] = Subjects.TicketCreated

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data :', data)
    console.log(data.price)

    msg.ack()
  }
}
