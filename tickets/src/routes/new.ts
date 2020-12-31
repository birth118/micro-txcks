import express, { request, Request, Response } from 'express'
//import { currentUser } from '@sytickets/common'
import { requireAuth, validateRequest } from '@sytickets/common'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import { natsWrapper } from '../nats-wrapper'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'

const router = express.Router()

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title')
      .trim()
      .not()
      .isEmpty()
      .withMessage('Ticket title should be provided'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price should be greter than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body

    // To save DB
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    })

    await ticket.save()

    // To publish ticketCreatedEvent to NATS Streaming

    const client = natsWrapper.client
    await new TicketCreatedPublisher(client).publish({
      title: ticket.title, // To make sure exact same DB value to be published
      price: ticket.price,
      id: ticket.id!,
      userId: ticket.userId,
      version: ticket.version,
    })

    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }
