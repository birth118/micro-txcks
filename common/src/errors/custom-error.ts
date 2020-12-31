// Q: How to make subclasses (i,e, RequestValidationError or DatabaseConnectionError)
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

//Option #2: Check how simialr signature to interface

export abstract class CustomError extends Error {
  abstract statusCode: number
  abstract serializeErrors(): { message: string; field?: string }[]

  constructor(message: string) {
    super(message)
    // Only because we extends built-in class
    Object.setPrototypeOf(this, CustomError.prototype)
  }
}
