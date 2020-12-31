import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

const buildTicket = (title: string) => {
  const ticket = Ticket.build({
    title: title,
    price: 301,
    id: mongoose.Types.ObjectId().toHexString(),
  })
  return ticket
}

it('throw not found error, 404', async () => {
  const orderId = mongoose.Types.ObjectId().toHexString()
  await request(app)
    .get('/api/orders/' + orderId)
    .set('Cookie', global.signin())
    .send()
    .expect(404)
})

it('throw not authorised, 401', async () => {
  //const orderId = mongoose.Types.ObjectId().toHexString()
  const ticket = buildTicket('Born again')
  await ticket.save()
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
    .get('/api/orders/' + order.id)
    .set('Cookie', global.signin())
    .send()
    .expect(401)
})

it('shows the order', async () => {
  const ticket = buildTicket('Born again')
  await ticket.save()
  const user1 = global.signin()

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201)

  //console.log(order)

  const { body: foundOrder } = await request(app)
    .get('/api/orders/' + order.id)
    .set('Cookie', user1)
    .send()
    .expect(200)

  expect(foundOrder.id).toEqual(order.id)
})
