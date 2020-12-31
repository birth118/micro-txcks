import express from 'express'
require('express-async-errors')
import { json } from 'body-parser'
import {
  NotFoundError,
  errorHandler,
  currentUser,
  requireAuth,
} from '@sytickets/common'
import cookieSession from 'cookie-session'
import { createTicketRouter } from '../src/routes/new'
import { showTicketRouter } from './routes/show'
import { listTicketsRouter } from './routes/index'
import { updateTicket } from './routes/update'

const app = express()
app.set('trust proxy', true) // to remind that Express sits behind (trustworthy ingress ) proxy

app.use(json())

// #1: cookie handling
app.use(
  cookieSession({
    signed: false, // To disable excryption
    //  secure: true, // cookie is only sent over HTTPs
    secure: process.env.NODE_ENV !== 'test', //  true:  cookie is only sent over HTTPs
  })
)

// #2: middlwware to get currentUser
app.use(currentUser)

// To defines routers

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(listTicketsRouter)
app.use(updateTicket)

// after checking all valid router
app.all('*', async (req, res, next) => {
  // For errors returned from asynchronous functions.
  // You must pass them to the next() function.
  // Then Express will deliver it to the error handler (i,e, errorHandler).
  // next(new NotFoundError('Not Found'))
  throw new NotFoundError('Not Found')
})

// You define error-handling middleware last, after other app.use() and routes calls
app.use(errorHandler)

export { app }