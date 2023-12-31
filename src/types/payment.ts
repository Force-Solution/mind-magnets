import { Model } from "mongoose";

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
    student: string;
    paymentType: string;
    payment: IPaymentDetails[] | IPaymentDetails;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPaymentDoc extends IPayment, Document {}
export interface IPaymentModel extends Model<IPaymentDoc> {}