import { Publisher, Subjects, TicketCreatedEvent } from '@sytickets/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated
}

// New TicketCreatedPublisher(client).publish(data)
