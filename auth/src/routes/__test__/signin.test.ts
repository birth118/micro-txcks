import request from 'supertest'
import { app } from '../../app'

// it('', async () => {})

it('Returns a 400 on unregistered email', async () => {
  const resp = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400)
})

it('Returns a 400 on unmatching password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'passwor',
    })
    .expect(400)
})

it('alows login with matching login credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  const resp = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)

  expect(resp.get('Set-Cookie')).toBeDefined()
})
