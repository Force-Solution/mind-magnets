import { IPayment, IPaymentDoc } from "@src/types/payment";
import Payment from "@src/dao/model/payment";

export class PaymentRepo{
    public async createPayment(payment: IPayment): Promise<IPaymentDoc>{
        return await Payment.create(payment);
    }
}