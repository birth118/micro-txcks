import { TicketCreatedEvent, Listener, Subjects } from '@sytickets/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = queueGroupName
  // queueGroupName: Only one subscriber out of many subscribers of this group will receive the event.
  // NATS Streaming will decide the receiving subscriber

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    //console.log(data)

    const { id, title, price } = data
    const ticket = Ticket.build({ id, title, price })
    await ticket.save()

    msg.ack() // we do ack() only when the received event SUCCESSFULLY processed
  }
}
