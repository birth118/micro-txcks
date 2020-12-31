import nats, { Message, Stan } from 'node-nats-streaming'
import { randomBytes } from 'crypto'

import { TicketCreatedListener } from './event/ticket-created-listener'

console.clear()

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
})

stan.on('connect', () => {
  console.log('Listener connected to NATS')

  stan.on('close', () => {
    console.log('NATS connection closed!')
    process.exit()
  })

  const ticketListener = new TicketCreatedListener(stan).listen()

  /*   const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    // To ack manually after the event properly processed rather than auto-immediatedly as soons as receiving
    // But this for this manual ACK,
    // Unless ack'ed manually, NATS will re-send the event after 30 minutes to the group queue listener(s)
    .setDeliverAllAvailable()
    // Redeliver all events from the beginning
    .setDurableName('orders-service')
  // Record the tracking of durable susbripton 'accounting-service'
  // working along queue group name below 'orders-service-queue-group'

  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    options
  ) */

  /*   subscription.on('message', (msg: Message) => {
    console.log('Message received')
    const data = msg.getData()
    if (typeof data === 'string') {
      console.log(`Received enet #${msg.getSequence()} with data: ${data}`)
    }
    msg.ack()
  }) */
})

process.on('SIGINT', () => {
  return stan.close()
})

process.on('SIGTERM', () => {
  return stan.close()
})
