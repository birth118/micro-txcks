export enum OrderStatus {
  // Order created but ticket is not reserved yet momentarily
  Created = 'created',

  // Order is trying to revserve the ticket which is already reserved by other other
  // Or, the user cancelled the order
  // Or, ther order expires before payment
  Cancelled = 'cancelled',

  // Order is waiting payment
  AwaitingPayment = 'awaiting:payment',

  // Order was paid
  Complete = 'complete',
}
