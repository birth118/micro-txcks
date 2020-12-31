import express, { Response, Request } from 'express'
import {
  NotFoundError,
  requireAuth,
  validateRequest,
  NotAuthorised,
  BadRequestError,
} from '@sytickets/common'
import { Ticket } from '../models/ticket'
import { body } from 'express-validator'
import { natsWrapper } from '../nats-wrapper'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'

const router = express.Router()

router.put(
  '/api/tickets/:id',
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
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
      throw new NotFoundError('Ticket Id is not found')
    }

    // console.log(typeof ticket.userId)
    // console.log(typeof req.currentUser!.id)

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorised()
    }

    // Rejectupdated if the ticker is in reserved.
    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket')
    }

    ticket.set({
      title: req.body.title,
      price: req.body.price,
    })

    await ticket.save()

    // To publish ticketUpdatedEvent to NATS Streaming
    const client = natsWrapper.client
    await new TicketUpdatedPublisher(client).publish({
      title: ticket.title, // To make sure exact same DB value to be published
      price: ticket.price,
      id: ticket.id!,
      userId: ticket.userId,
      version: ticket.version,
    })

    // console.log(ticket)

    res.send(ticket)
  }
)

export { router as updateTicket }
