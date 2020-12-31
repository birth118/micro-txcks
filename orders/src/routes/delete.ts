import express, { Request, Response } from 'express'
//import {body} from 'express-validator'
import { NotAuthorised, NotFoundError, requireAuth } from '@sytickets/common'
import { Order, OrderStatus } from '../models/order'

import { natsWrapper } from '../nats-wrapper'

import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await Order.findById(orderId).populate('ticket')
    if (!order) {
      throw new NotFoundError('the order is not found')
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorised()
    }

    order.status = OrderStatus.Cancelled
    await order.save()

    // publishing an event saying this is cancelled !
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id!,
      version: order.version,
      ticket: {
        id: order.ticket.id!,
      },
    })

    res.status(204).send(order) //    204 No Content. This causes no 'body'  returnes to client.
  }
)

export { router as deleteOrdersRouter }
