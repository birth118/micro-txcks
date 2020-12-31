import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'
import mongoose from 'mongoose'
it('cancels the order', async () => {
  const user = global.signin()

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Born again',
    price: 403.1,
  })
  await ticket.save()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
    .delete('/api/orders/' + order.id)
    .set('Cookie', user)
    .send()
    .expect(204)

  const { body: cancelled } = await request(app)
    .get('/api/orders/' + order.id)
    .set('Cookie', user)
    .send()
    .expect(200)

  expect(cancelled.status).toEqual(OrderStatus.Cancelled)
})

it('publishing an event saying this is cancelled !', async () => {
  const user = global.signin()

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Born again',
    price: 403.1,
  })
  await ticket.save()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
    .delete('/api/orders/' + order.id)
    .set('Cookie', user)
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
