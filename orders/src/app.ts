import express from 'express'
require('express-async-errors')
import { json } from 'body-parser'
import { NotFoundError, errorHandler, currentUser } from '@sytickets/common'
import cookieSession from 'cookie-session'
import { createOrdersRouter } from './routes/new'
import { showOrdersRouter } from './routes/show'
import { listOrdersRouter } from './routes/index'
import { deleteOrdersRouter } from './routes/delete'

const app = express()

// #0: Define Express proxy
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

// #3: To defines routers
app.use(createOrdersRouter)
app.use(showOrdersRouter)
app.use(listOrdersRouter)
app.use(deleteOrdersRouter)

// 4: after checking all valid router
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
