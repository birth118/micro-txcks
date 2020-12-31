// This middleware is only to extract the user payload from jwt token
// Business logic against authentication will be done by next middleware

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  id: string
  email: string
}

// Object augumenting in TS
// We want to augument Express's Request object to have 'currentUser' property
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session || !req.session.jwt) {
    return next()
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload

    req.currentUser = payload
  } catch (err) {}
  next()
}
