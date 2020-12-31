import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@sytickets/common'
import mongoose, { mongo } from 'mongoose'
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'

import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()
const EXPIRATION_WINDOWS_SECONDS = 60 * 1

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // if valid mongoDB objectId
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body

    // Find the ticket the user is trying to order
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) {
      throw new NotFoundError('The ticket not found') //404
    }

    // Make sure that the ticket is not already reserved;
    // Run query to look at all orders that 1) has the given ticket *and*
    // the status is *not* cancelled.
    // If we find an order from that means the ticket *is* already reserved by others

    // * Codes below moved to models/ticket for common use
    // const existingOrder = await Order.findOne({
    //   ticket: ticket,
    //   status: {
    //     $in: [
    //       OrderStatus.Created,
    //       OrderStatus.AwaitingPayment,
    //       OrderStatus.Complete,
    //     ],
    //   },
    // })

    const isReserved = await ticket.isReserved()

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved') //400
    }

    // Calculate exiresAt time for this order ( 15 minutes )

    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS)

    // Build the order and save it to the database

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    })

    await order.save()

    // Publish an event saying that an order was created

    const publisher = new OrderCreatedPublisher(natsWrapper.client)
    publisher.publish({
      id: order.id!,
      userId: order.userId,
      version: order.version,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(), // Cannot use 'order.expiresAt.toISOString()' because order.expiresAt is already JSON format by mongoose.
      ticket: {
        id: ticket.id!,
        price: ticket.price,
      },
    })
    // console.log(order)

    res.status(201).send(order)
  }
)

export { router as createOrdersRouter }
