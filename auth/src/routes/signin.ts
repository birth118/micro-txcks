import express, { Response, Request, NextFunction } from 'express'
import { body } from 'express-validator'
import { BadRequestError } from '@sytickets/common'

import { User } from '../models/user'
import { Password } from '../services/password'
import { validateRequest } from '@sytickets/common'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password must be 4 to 20 characters'),
  ],
  validateRequest, // middleware to validate Request
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      throw new BadRequestError('Login is incorrect')
    }

    if (!(await Password.compare(user.password, password))) {
      throw new BadRequestError('Login is incorrect')
    }

    // To generate jwt

    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // '!' circumvents TS checking.
    )
    // and save in the session object (cookie in this case)
    req.session = {
      jwt: userJWT,
    }

    res.status(201).send(user)
  }
)

export { router as signinRouter }
