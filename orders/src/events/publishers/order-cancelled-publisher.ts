import { Subjects, Publisher } from '@sytickets/common'
import { OrderCancelledEvent } from '@sytickets/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
