import express, { Request, Response } from 'express'
//import {body} from 'express-validator'
import { NotAuthorised, NotFoundError, requireAuth } from '@sytickets/common'
import { Order } from '../models/order'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    // const order = await Order.findOne({
    //   _id: req.params.orderId,
    //   userId: req.currentUser!.id,
    // }).populate('ticket')

    const order = await Order.findById(req.params.orderId).populate('ticket')

    if (!order) {
      throw new NotFoundError('The order is not found')
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorised()
    }

    res.send(order)
  }
)

export { router as showOrdersRouter }
