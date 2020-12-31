import { NotFoundError } from '@sytickets/common'
import express, { Request, Response } from 'express'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({
    orderId: undefined,
  })
  if (!tickets) {
    throw new NotFoundError('Tickets are not found')
  }
  // console.log(tickets)

  res.send(tickets)
})

export { router as listTicketsRouter }
