import { CustomError } from './custom-error'

export class BadRequestError extends CustomError {
  statusCode = 400
  message = ''
  constructor(msg: string) {
    super(msg)
    this.message = msg
    // Only because we extends built-in class
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors() {
    return [{ message: this.message }]
  }
}
