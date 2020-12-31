import express, { Request, Response } from 'express'
import { NotFoundError, requireAuth } from '@sytickets/common'
import { Order } from '../models/order'

const router = express.Router()

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket')

  if (orders.length < 1) {
    throw new NotFoundError('No orders found')
  }

  res.send(orders)
})

export { router as listOrdersRouter }
