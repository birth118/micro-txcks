import { Listener } from '@sytickets/common'
import { OrderCancelledEvent, Subjects } from '@sytickets/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName = queueGroupName
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = data.ticket
    const updated = await Ticket.findById(ticket.id)
    if (!updated) {
      throw new Error('The ticket is not found')
    }

    updated.set({ orderId: undefined }) // null would be OK as well
    await updated.save()

    await new TicketUpdatedPublisher(this.client).publish({
      id: updated.id!,
      title: updated.title,
      price: updated.price,
      userId: updated.userId,
      version: updated.version,
      orderId: updated.orderId,
    })

    msg.ack()
  }
}
