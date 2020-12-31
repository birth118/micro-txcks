import { Listener, OrderStatus, OrderCancelledEvent } from '@sytickets/common'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'
import mongoose from 'mongoose'

const setup = async function () {
  const listener = new OrderCancelledListener(natsWrapper.client)

  const orderId = mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: orderId,
    status: OrderStatus.Created,
    version: 0,
    userId: '123',
    price: 3045.1,
  })
  await order.save()

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 1,
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, order }
}

it('cancells order', async () => {
  const { listener, data, msg, order } = await setup()
  await listener.onMessage(data, msg)
  const cancelled = await Order.findById(data.id)

  expect(cancelled!.status).toEqual(OrderStatus.Cancelled)
})

it('ack msg', async () => {
  const { listener, data, msg, order } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
