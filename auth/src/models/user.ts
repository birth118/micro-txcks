import mongoose from 'mongoose'
import { Password } from '../services/password'

// 1. new Schema
// 3. alias to Model
// 2. export Model

// An interface that describes the properties that requires to create User object
interface UserAttrs {
  email: string
  password: string
}

// An interface that describes the propertoes that a User model has

interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument
}

// An interface that describes the properties that
// a User Document has

interface UserDocument extends mongoose.Document {
  email: string
  password: string
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Schema has configurable options
    toJSON: {
      transform(doc, ret) {
        delete ret.password // rarely used keyword in plain JS 'delete' to remove a property
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
      //versionKey: false,
    },
  }
)

// to encryt the password when user creation
userSchema.pre('save', async function (done) {
  const user = this

  if (user.isModified('password')) {
    const hashedPassword = await Password.toHash(user.get('password'))
    user.set('password', hashedPassword)
  }

  done()
})

// You can also add static functions to your model.
userSchema.statics.build = (attr: UserAttrs) => {
  return new User(attr)
}

const User = mongoose.model<UserDocument, UserModel>('User', userSchema)

// const user = User.build({
//   email: 'erwer@test.com',
//   password: '1234',
// })

export { User }
