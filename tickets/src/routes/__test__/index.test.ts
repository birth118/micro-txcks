import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { createTicketRouter } from '../new'

it('validates route handler listening to /api/tickets for get request', async () => {
  const resp = await request(app).get('/api/tickets').send()

  expect(resp.status).not.toEqual(404)
})

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title: 'Born again', price: 400.01 })
    .expect(201)
}

it('can fetch a list of tikcets', async () => {
  await createTicket()
  await createTicket()
  await createTicket()

  const resp = await request(app).get('/api/tickets').send().expect(200)
  // console.log(resp.body)

  expect(resp.body.length).toEqual(3)
})
