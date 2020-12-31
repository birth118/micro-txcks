import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator'
//import { RequestValidationError } from '../Errors/request-validation-error'
import { BadRequestError } from '@sytickets/common'
import { DatabaseConnectionError } from '@sytickets/common'
import { User } from '../models/user'
import jwt from 'jsonwebtoken'
import { validateRequest } from '@sytickets/common'

const router = express.Router()

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be 4 to 20 characters'),
  ],
  validateRequest, // middleware to validate Request
  async (req: Request, res: Response) => {
    const { email, password } = req.body

    // To check the user already exists
    const existingUser = await User.findOne({ email: email })

    if (existingUser) {
      // console.log('Existing user')
      // return res.status(400).send({})
      throw new BadRequestError('Email in use')
    }

    const user = User.build({ email, password })
    await user.save()

    // console.log('Createing a user')
    // throw new DatabaseConnectionError()
    // //throw new Error('DB connection error')

    // To generate jwt

    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // '!' circumvents TS checking.
    )
    // and save in the session object
    req.session = {
      jwt: userJWT,
    }

    res.status(201).send(user)
  }
)

export { router as signupRouter }
