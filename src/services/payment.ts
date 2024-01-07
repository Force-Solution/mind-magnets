import { PaymentRepo } from "@src/dao/repository/PaymentRepo";
import { IPayment, IPaymentDoc } from "@src/types/payment";

export const savePayment = async(payment: IPayment): Promise<IPaymentDoc> => {
    return new PaymentRepo().createPayment(payment);  
}

export const getPaymentPendingCountByType = async(type: string):Promise<Number> => {
    return new PaymentRepo().getPaymentPendingCountByType(type);
}