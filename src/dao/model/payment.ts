import { IPaymentDoc, IPaymentModel, PaymentTypes } from '@src/types/payment';
import mongoose, { Schema, model } from 'mongoose';

const schema = new mongoose.Schema<IPaymentDoc, IPaymentModel>({
  user: {
    type: String,
    ref: 'User',
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
    enum: [PaymentTypes.Installments, PaymentTypes.Lumpsum ]
  },
  payment:{
    type: Schema.Types.Mixed,
    default:{}
  }
}, {timestamps: true});

const Payment = model<IPaymentDoc, IPaymentModel>('Payment', schema);

export default Payment;
