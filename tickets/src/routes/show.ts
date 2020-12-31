import { app } from '../app'
import express, { Request, Response } from 'express'
import { NotFoundError } from '@sytickets/common'
import { Ticket } from '../models/ticket'

const router = express.Router()

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  //  console.log(req.params.id)

  const ticket = await Ticket.findById(req.params.id)
  if (!ticket) {
    throw new NotFoundError('Ticket is not found ')
    //return res.sendStatus(404)
  }

  res.send(ticket)
})

export { router as showTicketRouter }
