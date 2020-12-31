import mongoose, { Mongoose, MongooseDocument } from 'mongoose'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'
import { isStringTextContainingNode } from 'typescript'

// An interface that descrbes the properties that requires to crate Ticket object
interface TicketAtt {
  title: string
  price: number
  userId: string
}

// An interface describing a ticket document

interface TicketDocument extends mongoose.Document {
  title: string
  price: number
  userId: string
  version: number
  orderId?: string //'?' means this property is optional when the document is newly created
}

// An interafce describing a ticket model and build() function property

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attrs: TicketAtt): TicketDocument
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    // Schema has configurable options
    toJSON: {
      // since we know toJSON is called whenever a js object is stringified:
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
      //versionKey: false,
    },
  }
)

ticketSchema.set('versionKey', 'version') // renaming '__v' with custom 'version' field
ticketSchema.plugin(updateIfCurrentPlugin)

ticketSchema.statics.build = (attr: TicketAtt) => {
  return new Ticket(attr)
}

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  'Tickets',
  ticketSchema
)

export { Ticket }
