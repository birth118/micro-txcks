import { Subjects } from './subjects'

export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled
  data: {
    id: string
    // userId: string
    // status: OrderStatus.Cancelled
    // expiresAt: string // will use JSON.parse/stringigy() at in and out
    version: number
    ticket: {
      id: string
      // price: number
    }
  }
}
