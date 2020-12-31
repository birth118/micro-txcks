import mongoose, { Schema } from 'mongoose'

import { OrderStatus } from '@sytickets/common'
export { OrderStatus } // re-export

import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// // 0: Typescript setting with 5 interfaces
// // 1. Schema
// // 2. Model
// // 3. export the Model

// 0.0: Interface to define the properties that requires Order object
interface OrderAttr {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
}

// 0.1 : Interface to define the properties that a Order document has
interface OrderDocument extends mongoose.Document {
  userId: string
  status: OrderStatus
  expiresAt: Date
  ticket: TicketDoc
  version: number
}

// 0.2: Interface to define a static build method that creates an Order document
interface OrderModel extends mongoose.Model<OrderDocument> {
  build(attrs: OrderAttr): OrderDocument
}

//1. Schema

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus), // Mongoose to validate the enum
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      },
    },
  }
)

orderSchema.set('versionKey', 'version')
orderSchema.plugin(updateIfCurrentPlugin)

orderSchema.statics.build = (attrs: OrderAttr) => {
  return new Order(attrs)
}

//2. Model
const Order = mongoose.model<OrderDocument, OrderModel>('Order', orderSchema)

//3. Export the Model
export { Order }
