import mongoose, { Schema } from 'mongoose'

interface PaymentAttrs {
  orderId: string
  stripeId: string
}

interface PaymentDoc extends mongoose.Document {
  orderId: string
  stripeId: string
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc
}

const schema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      },
    },
  }
)

schema.statics.build = (attr: PaymentAttrs) => {
  return new Payment(attr)
}

export const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  schema
)
