import { DatabaseConnectionError } from '@sytickets/common'
import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'

import { natsWrapper } from '../../nats-wrapper'

// it.todo('validate user authenticated')

// it.todo('validate ticketId in request body')

it('validate ticket exiting from ticket Database, otherwise Not found 404', async () => {
  const ticketId = mongoose.Types.ObjectId()
  const cookie = global.signin()

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId })
    .expect(404)
})

it('validate if ticket is reserved, then bad request 400', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Born again',
    price: 403.1,
  })
  await ticket.save()

  const userId = mongoose.Types.ObjectId().toHexString()
  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds() + 15 * 60)

  const order = Order.build({
    userId,
    status: OrderStatus.Complete,
    expiresAt: expiration,
    ticket: ticket,
  })
  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400)

  // const found = await Ticket.findOne({ title: 'Born again' })
})

it('reserve a ticket, then order is created 201', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Born again',
    price: 403.1,
  })
  await ticket.save()

  const userId = mongoose.Types.ObjectId().toHexString()
  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds() + 15 * 60)

  const resp = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(resp.body.status).toEqual(OrderStatus.Created)
})

it('publish order:created event', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Born again',
    price: 403.1,
  })
  await ticket.save()

  const resp = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
