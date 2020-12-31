import { Listener, OrderCreatedEvent, Subjects } from '@sytickets/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  onMessage = async (data: OrderCreatedEvent['data'], msg: Message) => {
    const order = Order.build({
      id: data.id,
      status: data.status,
      version: data.version,
      userId: data.userId,
      price: data.ticket.price,
    })
    await order.save()

    msg.ack()
  }
}
