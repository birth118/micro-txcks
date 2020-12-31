import { Listener } from '@sytickets/common'
import { OrderCancelledEvent, Subjects, OrderStatus } from '@sytickets/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Order } from '../../models/order'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
  queueGroupName = queueGroupName

  onMessage = async (data: OrderCancelledEvent['data'], msg: Message) => {
    // const order = await Order.findByEvent(data)

    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    })

    if (!order) {
      throw new Error('Order not found: ' + data)
    }

    // if (order.status === OrderStatus.Cancelled) {
    //   msg.ack()
    //   throw new Error('Order is already cancelled')
    // }

    order.set({ status: OrderStatus.Cancelled })
    // order.set({ status: OrderStatus.Cancelled, version: data.version })
    await order.save()

    msg.ack()
  }
}
