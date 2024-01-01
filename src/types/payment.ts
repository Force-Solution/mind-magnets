import mongoose from "mongoose";
import {Document, Model } from "mongoose";

export const enum PaymentTypes{
    Installments="installments",
    Lumpsum="lumpsum"
}

interface IPaymentDetails{
    amount: number;
    paid: boolean;
    dueDate: Date;
}

export interface IPayment{
    paymentType: string;
    payment: IPaymentDetails[] | IPaymentDetails;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPaymentDoc extends IPayment, Document {
    _id: mongoose.Types.ObjectId
}
export interface IPaymentModel extends Model<IPaymentDoc> {}