import { Subjects, Publisher } from '@sytickets/common'
import { OrderCreatedEvent } from '@sytickets/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}
