import mongoose from 'mongoose'
import { Order, OrderStatus } from './order'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

// 0. Typescript 3 interfaces
// 1. new Schema
// 3. alias to model
// 2. export Model

interface TicketAttr {
  id: string
  title: string
  price: number
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttr): TicketDoc
  findByEvent(event: { id: string; version: number }): Promise<TicketDoc | null>
}

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

schema.set('versionKey', 'version') // renaming '__v' with custom 'version' field
schema.plugin(updateIfCurrentPlugin)

schema.statics.build = (attrs: TicketAttr) => {
  return new Ticket({
    _id: attrs.id, // by renaming to _id. MongoDB will not generate _id, but will use given attrs.id
    title: attrs.title,
    price: attrs.price,
  })
}

schema.statics.findByEvent = (event: { id: string; version: number }) => {
  const ticket = Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  })

  return ticket
}

schema.methods.isReserved = async function () {
  // this: the given ticket document that is called by isReserved()

  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  })

  return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', schema)

export { Ticket }
