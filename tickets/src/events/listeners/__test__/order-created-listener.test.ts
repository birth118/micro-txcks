import { Ticket } from '../../../models/ticket'
import { OrderCreatedEvent, OrderStatus } from '@sytickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCreatedListener } from '../order-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { isExportDeclaration } from 'typescript'

const setup = async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'Born again',
    price: 301.4,
    userId: '1234',
  })

  await ticket.save()

  // create a fake event data

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 1,
    userId: ticket.userId,
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }

  // create a fake NATS message
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  // create a listener

  const listener = new OrderCreatedListener(natsWrapper.client)

  // Return them all
  return { ticket, data, msg, listener }
}

it('marks the ticket with its orderId', async () => {
  const { ticket, data: order, msg, listener } = await setup()
  // console.log(order)

  // do onMessage
  await listener.onMessage(order, msg)

  // Assert to make sure the ticket is updated with its orderId
  const updated = await Ticket.findById(ticket.id)
  console.log(updated)

  expect(updated!.orderId).toEqual(order.id)
})

it('acks when the ticket is upatred with its orderId', async () => {
  const { ticket, data: order, msg, listener } = await setup()
  // console.log(order)

  // do onMessage
  await listener.onMessage(order, msg)

  // Assert to make sure the acks when the ticket is upatred with its orderId
  expect(msg.ack).toHaveBeenCalled()
})

it('publishes ticket update event', async () => {
  const { ticket, data: order, msg, listener } = await setup()
  // console.log(order)

  // do onMessage
  await listener.onMessage(order, msg)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

  const updatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )
  expect(updatedData.orderId).toEqual(order.id)
})
