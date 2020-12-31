import { Request, Response, NextFunction } from 'express'
import { NotAuthorised } from '../errors/not-authorised-error'
import jwt from 'jsonwebtoken'

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorised()
  }
  next()
}

// export const isAuthenticated = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   // if cookie: req.session.jwt does not exists
//   if (!req.session || !req.session.jwt) {
//     return res.send({ currentUser: null })
//   }

//   // if the cookie is tampered
//   try {
//     const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!)
//     res.send({ currentUser: payload })
//     next()
//   } catch (err) {
//     return res.send({ currentUsr: null })
//   }
// }
