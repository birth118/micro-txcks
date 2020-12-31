import request from 'supertest'
import { app } from '../../app'

it('responds with details about current user', async () => {
  // const signedUp = await request(app)
  //   .post('/api/users/signup')
  //   .send({
  //     email: 'test@test.com',
  //     password: 'passw0rd',
  //   })
  //   .expect(201)

  const cookie = await global.signin()

  const resp = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(400)

  expect(resp.body.currentUser.email).toBe('test@test.com')
})

it('responds with null if not authenticated', async () => {
  const resp = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)

  expect(resp.body.currentUser).toEqual(null)
})
