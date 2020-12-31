import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from '@sytickets/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated
  queueGroupName = queueGroupName
  // queueGroupName: Only one subscriber out of many subscribers of this group will receive the event.
  // NATS Streaming will decide the receiving subscriber

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    //console.log(data)

    const { id, title, price, version } = data

    const ticket = await Ticket.findByEvent(data)
    if (!ticket) {
      throw new NotFoundError('The ticket is not found')
    }
    ticket.set({
      title,
      price,
    })
    await ticket.save()

    msg.ack() // we do ack() only when the received event SUCCESSFULLY processed
  }
}
