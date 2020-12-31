import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('return 404 if ticket is not found', async () => {
  const id = mongoose.Types.ObjectId() // to create valid objectID for testing

  await request(app)
    .get('/api/tickets/' + id)
    .send()
    .expect(404)
  //console.log(resp.body)
})

it('return the ticket if ticket is found', async () => {
  const title = 'Brn again'
  const price = 300.5

  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201)

  //console.log(resp.body)
  const ticket = await request(app)
    .get('/api/tickets/' + resp.body.id)
    .send()
    .expect(200)

  expect(ticket.body.title).toEqual(title)
  expect(ticket.body.price).toEqual(price)
})
