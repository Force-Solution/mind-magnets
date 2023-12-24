import { ITokenDoc, ITokenModel, tokenType } from '@src/types/token';
import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema<ITokenDoc, ITokenModel>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: String,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        tokenType.REFRESH,
        tokenType.RESET_PASSWORD,
        tokenType.VERIFY_EMAIL,
      ],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Token = mongoose.model<ITokenDoc, ITokenModel>('Token', tokenSchema);

export default Token;