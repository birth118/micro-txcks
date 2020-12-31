import { CustomError } from './custom-error'

export class NotAuthorised extends CustomError {
  statusCode = 401

  constructor() {
    super('Not authorised')

    Object.setPrototypeOf(this, NotAuthorised.prototype)
  }
  serializeErrors() {
    return [{ message: 'Not authorised' }]
  }
}
