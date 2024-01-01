import { PaymentRepo } from "@src/dao/repository/PaymentRepo";
import { IPayment, IPaymentDoc } from "@src/types/payment";

export const savePayment = async(payment: IPayment): Promise<IPaymentDoc> => {
    return new PaymentRepo().createPayment(payment);  
}

export const getPaymentPendingCountOfInstallments = async():Promise<Number> => {
    return new PaymentRepo().getPaymentPendingCountForInstallments();
}