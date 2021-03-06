import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'
import jwt from 'jsonwebtoken'

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[]
    }
  }
}

jest.mock('../nats-wrapper')

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
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = () => {
  // Instead of accessing  auth service to get valida cookie
  // We create cookie here and reqtun it

  const testPayload = {
    // id: '5fb700cff67cc1001954a4c0',
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'user011@user01.com',
  }

  // create the JWT
  const token = jwt.sign(
    testPayload,
    process.env.JWT_KEY! // '!' circumvents TS checking.
  )

  // and save in the session object (cookie in this case)
  const session = {
    jwt: token,
  }

  // Turn that session to JSON
  const sessionJSON = JSON.stringify(session)

  // Take the JSON string  and encode it to base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  return [`express:sess=${base64}`]
}
