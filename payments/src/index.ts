import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

const port = process.env.PORT || 3000

const start = async () => {
  //   DB_TEST_URL=mongodb://127.0.0.1:27017

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined')
  }

  // const url = 'mongodb://tickets-mongo-srv:27017'
  // const dbName = 'tickets'

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined')
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL is not defined')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID is not defined')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID is not defined')
  }
  const clusterId = process.env.NATS_CLUSTER_ID
  const clientId = process.env.NATS_CLIENT_ID
  const natsUrl = process.env.NATS_URL

  try {
    await natsWrapper.connect(
      //   'ticketing',
      //   randomBytes(4).toString('hex'),
      //   'http://nats-srv:4222'
      //
      clusterId,
      clientId,
      natsUrl
    )

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!')
      process.exit()
    })

    process.on('SIGTERM', () => natsWrapper.client.close())
    process.on('SIGINT', () => natsWrapper.client.close())

    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      //  useFindAndModify: false,
    })
    console.log('MongoDB connected')
  } catch (err) {
    console.log(err)
    //throw new DatabaseConnectionError()
  }
}

app.listen(port, () => {
  console.log('payments service up!:', port)
})

start()
