import { TicketUpdatedListener } from '../ticket-updated-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketUpdatedEvent } from '@sytickets/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // create listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  // create  and save a ticket

  const ticketId = mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    id: ticketId,
    title: 'Born again',
    price: 304.01,
  })
  await ticket.save()

  // create fake event data to update the ticket

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'Born again2',
    price: 3041.1,
    userId: '123',
    version: ticket.version + 1,
  }
  // create fake message
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }
  // return them all
  return { listener, data, msg, ticket }
}

it('find, update and save the ticket', async () => {
  const { listener, data, msg, ticket } = await setup()
  await listener.onMessage(data, msg)
  const updated = await Ticket.findById(ticket.id)

  expect(updated!.title).toEqual(data.title)
})

it('ack the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack()  for out of version', async () => {
  const { listener, data, msg } = await setup()
  data.version = data.version + 1

  try {
    await listener.onMessage(data, msg)
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled()
})
