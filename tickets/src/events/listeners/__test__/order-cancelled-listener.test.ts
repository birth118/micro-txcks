import { Ticket } from '../../../models/ticket'
import { OrderCancelledEvent } from '@sytickets/common'
import mongoose from 'mongoose'
import { OrderCancelledListener } from '../order-cancelled-listener'
import { natsWrapper } from '../../../nats-wrapper'

const setup = async () => {
  // create a ticket
  const orderId = mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'Born again',
    price: 405.01,
    userId: '123',
  })
  ticket.set({ orderId: orderId })
  await ticket.save()

  // create a fake OrderCancelledEVent  data

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 1,
    ticket: {
      id: ticket.id,
    },
  }

  // crate a fake NATS Message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  // create OrderCancelledListener
  const listener = new OrderCancelledListener(natsWrapper.client)

  // Return them all
  return { listener, msg, data, ticket }
}

it('updates the ticket with orderid cancellation', async () => {
  const { listener, msg, data: order, ticket } = await setup()

  await listener.onMessage(order, msg)
  const updated = await Ticket.findById(ticket.id)
  if (!updated) {
    throw new Error('Ticket not found')
  }

  expect(updated.orderId).toBeUndefined()
})

it('ack the msg', async () => {
  const { listener, msg, data: order, ticket } = await setup()

  await listener.onMessage(order, msg)
  const updated = await Ticket.findById(ticket.id)
  if (!updated) {
    throw new Error('Ticket not found')
  }

  expect(msg.ack).toHaveBeenCalled()
})

it('publish ticket updated event', async () => {
  const { listener, msg, data: order, ticket } = await setup()

  await listener.onMessage(order, msg)
  const updated = await Ticket.findById(ticket.id)
  if (!updated) {
    throw new Error('Ticket not found')
  }
  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const published = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )
  expect(published.orderId).toBeUndefined()
})
