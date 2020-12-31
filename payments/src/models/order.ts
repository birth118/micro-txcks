import mongoose from 'mongoose'
import { OrderStatus } from '@sytickets/common'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { OrderCancelledEvent } from '@sytickets/common'
import { updateIf } from 'typescript'

// Three interfaces; Attributes, mongooose.Document & mongoose.Model

interface OrderAttrs {
  id: string
  status: OrderStatus
  version: number
  userId: string
  price: number
}

interface OrderDoc extends mongoose.Document {
  // id: is not needed as mongoose.Document already has it
  status: OrderStatus
  version: number
  userId: string
  price: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attr: OrderAttrs): OrderDoc
  findByEvent(data: OrderCancelledEvent['data']): OrderDoc
}

const schema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    // version: is not required as OCC (update-if-current) would take care
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      require: true,
    },
  },
  {
    toJSON: {
      // use this option when convert to JSON representation
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

schema.set('versionKey', 'version') // mongoose will overwrite '__v' with custom 'version' field
schema.plugin(updateIfCurrentPlugin)

schema.statics.build = (attr: OrderAttrs) => {
  return new Order({
    _id: attr.id, // to let mongoDB to use attr.id when it creates default _id
    userId: attr.userId,
    status: attr.status,
    price: attr.price,
    version: attr.version,
  })
}

//const order = await Order.findByEvent(data)
schema.statics.findByEvent = async (data: OrderCancelledEvent['data']) => {
  return await Order.findOne({
    _id: data.id,
    version: data.version - 1,
  })
}

export const Order = mongoose.model<OrderDoc, OrderModel>('Order', schema)
