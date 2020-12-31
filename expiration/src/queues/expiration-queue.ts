import Queue from 'bull'
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher'
import { natsWrapper } from '../nats-wrapper'

interface Payload {
  orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
})

// Process the added job
expirationQueue.process(async (job) => {
  // console.log(
  //   'Now to publish expration:complete event for orderId. ',
  //   job.data.orderId
  // )

  // Publish expiration complete event after the delay
  await new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  })
})

export { expirationQueue }
