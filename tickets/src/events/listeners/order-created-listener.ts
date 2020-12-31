import { Listener, OrderCreatedEvent, Subjects } from '@sytickets/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'
import { natsWrapper } from '../../nats-wrapper'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id: orderId, ticket } = data

    // Find the ticket that the order is resersing
    const foundTicket = await Ticket.findById(ticket.id)
    if (!foundTicket) {
      throw new Error('Ticket is not found')
    }
    // Mark the ticket as being reserved by setting its orderId property
    foundTicket.set({ orderId: orderId })

    //save the ticket
    await foundTicket.save()

    // to publish ticket updated
    await new TicketUpdatedPublisher(this.client).publish({
      id: foundTicket.id!,
      title: foundTicket.title,
      price: foundTicket.price,
      userId: foundTicket.userId,
      version: foundTicket.version,
      orderId: foundTicket.orderId,
    })

    // ack to NATS
    msg.ack()
  }
}
