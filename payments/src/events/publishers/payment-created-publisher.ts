import { Publisher } from '@sytickets/common'

import { PaymentCreatedEvent, Subjects } from '@sytickets/common'
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
