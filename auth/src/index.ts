import mongoose from 'mongoose'
import { app } from './app'

const port = process.env.PORT || 3000

const start = async () => {
  console.log('Starting...')

  //   DB_TEST_URL=mongodb://127.0.0.1:27017

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is not defined')
  }

  // const url = 'mongodb://auth-mongo-srv:27017'
  // const dbName = 'auth'
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not defined')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    console.log('MongoDB connected')
  } catch (err) {
    console.log(err)
    //throw new DatabaseConnectionError()
  }
}

app.listen(port, () => {
  console.log('auth service up!:', port)
})

start()
