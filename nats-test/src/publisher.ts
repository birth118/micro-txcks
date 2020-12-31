import nats, { Stan } from 'node-nats-streaming'
import { TicketCreatedEvent } from './event/ticket-created-event'
import { Subjects } from './event/subjects'

import { TicketCreatedPublisher } from './event/ticket-created-publisher'
import { TicketCreatedListener } from './event/ticket-created-listener'

console.clear()

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
})

stan.on('connect', async () => {
  console.log('Publisher conneced to NATS')

  const ticketCreatedPublisher = new TicketCreatedPublisher(stan)

  const data: TicketCreatedEvent['data'] = {
    id: '123',
    title: 'born again',
    price: 508.1,
  }

  try {
    await ticketCreatedPublisher.publish(data)
  } catch (err) {
    console.log(err)
  }

  // const eventData: TicketCreatedEvent = {
  //   subject: Subjects.TicketCreated,
  //   data: {
  //     id: '123',
  //     title: 'born again',
  //     price: 301.03,
  //   },
  // }

  // const data = JSON.stringify(eventData.data)
  // stan.publish(eventData.subject, data, (err, guid) => {
  //   console.log('Event published')
  // })
})
