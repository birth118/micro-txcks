import { CustomError } from './custom-error'

// Q: How to make this subclasses (i,e, RequestValidationError or DatabaseConnectionError)
//    more robust by avoiding runtime errors such as typo error, possble inconsistency, ..
// A: Option #1 to use interface to complying properties
//    Option #2 to use abstract class to shape out the exact sinature of each subclass
//        As-Is : Error (built-in)  --> RequestValidationError or DatabaseConnectionError
//        To-Be:  Error (built-in) --> abstract --> RequestValidationError or DatabaseConnectionError

/* Option #1: interface 

interface CustomErrorInterface {
  statusCode: number
  serializeErrors(): {
    message: string
    field?: string
  }[]
}
*/

export class DatabaseConnectionError extends CustomError {
  reason = 'Error connection to Database'
  statusCode = 500
  constructor() {
    super('Database connetion error')

    // Only because we extends built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [{ message: this.reason }]
  }
}
