import { Ticket } from '../../../models/ticket'
import { TicketCreatedListener } from '../ticket-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedEvent } from '@sytickets/common'
import { Message } from 'node-nats-streaming'

import mongoose from 'mongoose'

const setup = async () => {
  // create a listener
  const listener = new TicketCreatedListener(natsWrapper.client)
  // create a fake event data
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Born Again',
    price: 304.01,
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  // create a fake msg
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
    // we only need this function signature as fake. so Mock it!!
    // Even no implmentation is needed
  }

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()

  // call the onMessage() with the data and msg
  await listener.onMessage(data, msg)

  // write assertion to check if the ticket created
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
})

it('ack the message', async () => {
  // create a listener
  // create a fake event data
  // create a fake msg

  const { listener, data, msg } = await setup()
  // call the onMessage() with the data and msg
  await listener.onMessage(data, msg)
  // write assestion to make sure the ack() function called
  expect(msg.ack).toHaveBeenCalled()
})
