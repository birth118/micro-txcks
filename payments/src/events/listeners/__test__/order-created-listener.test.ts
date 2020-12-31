import { OrderCreatedListener } from '../order-created-listener'
import { OrderCreatedEvent, OrderStatus } from '@sytickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { natsWrapper } from '../../../nats-wrapper'
import { Order } from '../../../models/order'

const setup = async () => {
  // fake event data
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    ticket: {
      id: mongoose.Types.ObjectId().toHexString(),
      price: 304.01,
    },
  }
  //fake Msg
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  const listener = new OrderCreatedListener(natsWrapper.client)

  return { data, msg, listener }
}

it('replicates order', async () => {
  const { data, msg, listener } = await setup()
  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)
  expect(order!.id).toEqual(data.id)
})

it('acks msg', async () => {
  const { data, msg, listener } = await setup()
  await listener.onMessage(data, msg)
  expect(msg.ack).toHaveBeenCalled()
})
