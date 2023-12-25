import { Model } from "mongoose";

export const enum PaymentTypes{
    Installments="installments",
    Lumpsum="lumpsum"
}

interface IBasePayment{
    amount: number;
    paid: boolean;
}

interface IInstallment extends IBasePayment{
    dueDate: Date;
}

export interface IPayment{
    user: string;
    paymentType: string;
    payment: {installment: IInstallment[]} | {lumpsum: IBasePayment};
    createdAt: Date;
    updatedAt: Date;
}

export interface IPaymentDoc extends IPayment, Document {}
export interface IPaymentModel extends Model<IPaymentDoc> {}