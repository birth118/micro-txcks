import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

const start = async () => {
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
  } catch (err) {
    console.log(err)
    //throw new DatabaseConnectionError()
  }
}

start()
