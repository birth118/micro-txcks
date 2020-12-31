import { Subjects } from './subjects'
import { OrderStatus } from './types/order-status'

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated
  data: {
    id: string
    version: number
    userId: string
    status: OrderStatus
    expiresAt: string // will use order.expiredAt.toISOString() to represent unversial (UTC) time
    ticket: {
      id: string
      price: number
    }
  }
}
