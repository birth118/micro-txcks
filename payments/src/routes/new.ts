import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  BadRequestError,
  NotAuthorised,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@sytickets/common'
import { Order } from '../models/order'
import { Payment } from '../models/payment'
import { stripe } from '../stripe'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)
    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorised()
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cancelled order')
    }

    // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: 'aud',
      source: token,
      description: 'My First Test Charge (created for API docs)',
    })

    const payment = Payment.build({ orderId, stripeId: charge.id })
    await payment.save()

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id!,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    })

    res.status(201).send({ id: payment.id })
  }
)

export { router as createChargeRouter }
