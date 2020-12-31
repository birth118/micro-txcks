import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { natsWrapper } from '../../nats-wrapper'

it('validates route handler listening to /api/tickets for post request', async () => {
  const resp = await request(app).post('/api/tickets').send({})

  expect(resp.status).not.toEqual(404)
})

it('can only be accessed if the user signed in', async () => {
  const resp = await request(app).post('/api/tickets').send({})

  expect(resp.status).toEqual(401)
})

it('validate the user signed in ( not 401 )', async () => {
  const cookie = global.signin()

  //const cookie =
  //  'express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalZtWWpjd01HTm1aalkzWTJNeE1EQXhPVFUwWVRSak1DSXNJbVZ0WVdsc0lqb2lkWE5sY2pBeE1VQjFjMlZ5TURFdVkyOXRJaXdpYVdGMElqb3hOakExT0RNeE5EVTRmUS5WMnNlV0RuZ1dIM2pQWm1EWXNXRUYzOUZ2WGEyQTBUMzhOaUZ2R2ZXV1pZIn0='

  // console.log(cookie)

  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({})

  expect(resp.status).not.toEqual(401)
})

it('validate if ticket title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 2000,
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 2000,
    })
    .expect(400)
})

it('validate if price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'B gagin',
      price: -10,
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'B again',
    })
    .expect(400)
})

it('creates a ticket valid inputs', async () => {
  // add in a check to make sure to create in MongoDB

  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  const title = 'Brn again'

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 300.1,
    })
    .expect(201)

  tickets = await Ticket.find({})
  expect(tickets[0].price).toEqual(300.1)
  expect(tickets[0].title).toEqual(title)
})

it('publishes an event', async () => {
  const title = 'Brn again'

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 300.1,
    })
    .expect(201)

  // console.log(natsWrapper)
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
