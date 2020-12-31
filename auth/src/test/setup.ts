import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>
    }
  }
}

let mongo: any

process.env.JWT_KEY = 'SECRET'

beforeAll(async () => {
  mongo = new MongoMemoryServer()
  const url = await mongo.getUri()
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

// Flushing before each test

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = async () => {
  const email = 'test@test.com'
  const password = 'passw0rd'

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201)

  const cookie = response.get('Set-Cookie')

  return cookie
}
