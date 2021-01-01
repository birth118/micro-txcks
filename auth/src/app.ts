import express from 'express'
require('express-async-errors')
import { json } from 'body-parser'
import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { NotFoundError, errorHandler } from '@sytickets/common'

import cookieSession from 'cookie-session'

const app = express()
app.set('trust proxy', true) // to remind that Express sits behind (trustworthy ingress ) proxy

app.use(json())
app.use(
  cookieSession({
    signed: false, // To disable excryption
    //  secure: true, // cookie is only sent over HTTPs
    // secure: process.env.NODE_ENV !== 'test', //  true:  cookie is only sent over HTTPs
    secure: false, // cookie can be sent over HTTP, not HTTPs
  })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

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
