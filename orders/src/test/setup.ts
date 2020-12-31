import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

let mongo: any

jest.mock('../nats-wrapper')

// connect to MongoMemoryServer
beforeAll(async () => {
  mongo = new MongoMemoryServer()
  const url = await mongo.getUri()
  await mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

// flush before each test
beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for (let collection of collections) {
    await collection.deleteMany({})
  }
})

// disconnect from MongoMemoryServe
afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[]
    }
  }
}

process.env.JWT_KEY = 'SECRET'

global.signin = () => {
  const testPayload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'user@user.com',
  }

  // Create jwt token with the payload
  const token = jwt.sign(testPayload, process.env.JWT_KEY!)

  // Store the jwt token in the session object
  const session = {
    jwt: token,
  }

  // Convert the session object to JSON string
  const sessionJSON = JSON.stringify(session)

  // Create fake cokkie: Take the JSON string and encode to base 64 like cookie
  const base64 = Buffer.from(sessionJSON).toString('base64')

  const cookie = `express:sess=${base64}`

  // const parsedCookie = JSON.parse(cookie)
  // const payload = jwt.verify(parsedCookie.jwt, process.env.JWT_KEY!)
  // console.log(payload)

  return [cookie]
}
