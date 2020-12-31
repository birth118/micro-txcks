import request from 'supertest'
import { app } from '../../app'

// it('', async () => {})

it('Returns a 201 on successfil signup', async () => {
  return await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201)
})

it('Returns a 400 with invalid email', async () => {
  const resp = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: 'password',
    })
    .expect(400)
})

it('Returns a 400 with invalid password', async () => {
  const resp = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'pas',
    })
    .expect(400)
})

it('Returns a 400 with no email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com' })
    .expect(400)
  await request(app)
    .post('/api/users/signup')
    .send({ password: '112345' })
    .expect(400)
})

it('Disallows duplicate email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: '123456' })
    .expect(201)

  await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: '123456' })
    .expect(400)
})

it('sets a cookie after successful signup', async () => {
  const resp = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: '123456' })
    .expect(201)

  expect(resp.get('Set-Cookie')).toBeDefined()
})
