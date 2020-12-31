// These will enforce to use S'ubjects.TicketCreated  instead of typo-prone 'ticket:created'
// Otherwise, Miki perhaps will use 'Ticket:Created' instead of 'ticket:created'
// This is all the way to prevent to use plain string 'ticket:created' because it is type-prone

export enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',

  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled',

  ExpirationComplete = 'expiration:complete',

  PaymentCreated = 'payment:created',
}

// Test code
// const printSubject = (Subject: Subjects) => {}
// printSubject(Subjects.TicketCreated)
