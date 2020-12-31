import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import mongoose, { mongo } from 'mongoose'
import { createTicketRouter } from '../new'
import { natsWrapper } from '../../nats-wrapper'

const updateTicket = {
  title: 'Born now',
  price: 250.02,
}

it('if given ticket id does not exist, 404', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put('/api/tickets/' + id)
    .set('Cookie', global.signin())
    .send(updateTicket)
    .expect(404)
})

it('To validate if user is not logged in (authenticated), 401', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()

  await request(app)
    .put('/api/tickets/' + id)
    //  .set('Cookie', global.signin())
    .send(updateTicket)
    .expect(401)
})

it('To validate if user is not owner of the ticket, 401', async () => {
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'born again', price: 202.03 })

  await request(app)
    .put('/api/tickets/' + resp.body.id)
    .set('Cookie', global.signin())
    .send({ title: 'born again vol2', price: 200.03 })
    .expect(401)
})

it('If either title or price is invalid, 400', async () => {
  const cookie = global.signin()

  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'born again', price: 202.03 })

  await request(app)
    .put('/api/tickets/' + resp.body.id)
    .set('Cookie', cookie)
    .send({ title: '', price: 300 })
    .expect(400)

  await request(app)
    .put('/api/tickets/' + resp.body.id)
    .set('Cookie', cookie)
    .send({ title: 'born', price: -300 })
    .expect(400)
})

it('To validate the update is succeeded', async () => {
  const cookie = global.signin()

  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'born again', price: 202.03 })

  const update = await request(app)
    .put('/api/tickets/' + resp.body.id)
    .set('Cookie', cookie)
    .send({ title: 'born again2', price: 300 })
    .expect(200)

  expect(update.body.title).toEqual('born again2')
  expect(update.body.price).toEqual(300)
})

it('publishes an event', async () => {
  const cookie = global.signin()

  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'born again', price: 202.03 })
    .expect(201)

  const update = await request(app)
    .put('/api/tickets/' + resp.body.id)
    .set('Cookie', cookie)
    .send({ title: 'born again2', price: 300 })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it(' Cannot edit a reserved ticket', async () => {
  const cookie = global.signin()

  // Create ticket
  const { body } = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'born again', price: 202.03 })
    .expect(201)

  // set orderId
  const update = await Ticket.findById(body.id)
  update!.set({ orderId: mongoose.Types.ObjectId().toHexString() })
  await update!.save()

  //expect reject 400
  await request(app)
    .put('/api/tickets/' + body.id)
    .set('Cookie', cookie)
    .send({ title: 'born again2', price: 300 })
    .expect(400)
})
