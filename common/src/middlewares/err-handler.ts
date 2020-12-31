import e, { Request, Response, NextFunction } from 'express'
// import { RequestValidationError } from '../Errors/request-validation-error'
// import { DatabaseConnectionError } from '../Errors/database-connection-error'
import { CustomError } from '../errors/custom-error'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  }
  // if (err instanceof DatabaseConnectionError) {
  //   return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  // }

  // if (err instanceof RequestValidationError) {
  //   return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  // }

  console.error(err)

  res.status(500).send({ errors: [{ message: 'Unknown Error' }] })
}

/* 

Custom Error Structure

{
  errors:{
    message: string,
    field?: string
  }[]
} 

*/
