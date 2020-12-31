import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { Payment } from '../../models/payment'
import { OrderStatus } from '@sytickets/common'
import { stripe } from '../../stripe'

// jest.mock('../../stripe') // bring in __mock__ when it is referred '../../stripe'

it('validates the order from Order DB, 404', async () => {
  const user = global.signin()

  // const { body: order } = await request(app)
  //   .post('/api/tickets')
  //   .set('Cookie', user)
  //   .send({
  //     title: 'Born again',
  //     price: 204,
  //   })
  //   .expect(201)

  const { body: ticket } = await request(app)
    .post('/api/payments')
    .set('Cookie', user)
    .send({
      token: 'tok1234',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404)
})

it('validates userId aginst Order 401', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: mongoose.Types.ObjectId().toHexString(),
    price: 304,
  })

  await order.save()

  const { body: ticket } = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'tok1234',
      orderId: order.id,
    })
    .expect(401)
})

it('validates cancelled order.status, 400', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    version: 0,
    userId,
    price: 304,
  })

  await order.save()

  const { body: ticket } = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok1234',
      orderId: order.id,
    })
    .expect(400)
})

it('charges payment, 201', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()
  const price = Math.floor(Math.random() * 100000)
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId,
    price,
  })

  await order.save()

  const { body: ticket } = await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)

  // const stripe = require('stripe')(
  //   'sk_test_51I22CYDAiM1Z8WM6O5TgAF3C7FUpyt569ElSGviJIneLDmgRBfCavGNko2VLECCy28sp1nvEvy7npO8u8zb5I9qZ00KjvRtVPJ'
  // )

  const charges = await stripe.charges.list({
    limit: 50,
  })

  const myCharge = charges.data.find((item) => {
    return item.amount === price * 100
  })
  // console.log(myCharge)

  expect(myCharge).toBeDefined()

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: myCharge!.id,
  })

  expect(payment).not.toBeNull()
})
