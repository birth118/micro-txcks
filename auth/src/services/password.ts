import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'

// To conver sync funtion to Promise async function
// Now we can use async/await
const scryptAsync = promisify(scrypt)

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex')
    const buffer = (await scryptAsync(password, salt, 64)) as Buffer
    // without 'as Buffer', TS has no idea what type of 'buffer' variable is
    return `${buffer.toString('hex')}.${salt}`
  }
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.')
    // console.log('salt:', salt)
    // console.log('STR:', storedPassword)
    const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer
    // console.log('PVD:', buffer.toString('hex'))

    return buffer.toString('hex') === hashedPassword ? true : false
  }
}
