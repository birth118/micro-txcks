import { ExpirationCompleteListener } from '../expiration-complete-listener'
import { Order } from '../../../models/order'
import { Ticket } from '../../../models/ticket'
import mongoose from 'mongoose'
import { OrderStatus, ExpirationCompleteEvent } from '@sytickets/common'
import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  // Create an ticket and order
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Born again',
    price: 405,
  })
  await ticket.save()

  const order = Order.build({
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  })

  await order.save()

  // Create expiration:complete event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // Create expiration:complete listener
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  // make mock up msg
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  // return them all
  return { listener, data, ticket, order, msg }
}

it('cancels the order', async () => {
  const { listener, data, msg } = await setup()

  // onMessage()
  await listener.onMessage(data, msg)

  // Asset the order status
  const cancelled = await Order.findById(data.orderId)
  expect(cancelled!.status).toEqual(OrderStatus.Cancelled)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()

  // onMessage()
  await listener.onMessage(data, msg)

  // Asset the msg.ack()
  expect(msg.ack).toHaveBeenCalled()
})
it('publishes order cancel event', async () => {
  const { listener, data, msg } = await setup()

  // onMessage()
  await listener.onMessage(data, msg)

  // publish order:cancelled event
  // Assert the publishing
  expect(natsWrapper.client.publish).toHaveBeenCalled()

  console.log((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

  const published = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )

  expect(published.id).toEqual(data.orderId)
})
