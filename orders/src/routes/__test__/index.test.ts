import { NotFoundError } from '@sytickets/common'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Ticket } from '../../models/ticket'

it('No order found, 404', async () => {
  const resp = await request(app)
    .get('/api/orders')
    .set('Cookie', global.signin())
    .expect(404)
})

const buildTicket = (title: string) => {
  const ticket = Ticket.build({
    title: title,
    price: 301,
    id: mongoose.Types.ObjectId().toHexString(),
  })
  return ticket
}

it('Lists all orders', async () => {
  // Create 3 tickets
  // Create 1 order as user1
  // Create 2 order as user2
  // Make request to get 2 oders for user2
  // Make sure to get only orders for user2

  const user1 = global.signin()
  const user2 = global.signin()

  const ticket1 = await buildTicket('user1').save()
  const ticket2 = await buildTicket('user2.1').save()
  const ticket3 = await buildTicket('user2.2').save()

  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201)

  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201)

  const { body: order3 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201)

  const { body: user2_Orders } = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200)

  // console.log(JSON.parse(text))

  expect(user2_Orders.length).toEqual(2)
})
