import { PaymentRepo } from "@src/dao/repository/PaymentRepo";
import { IPayment, IPaymentDoc } from "@src/types/payment";
import { IUserDoc } from "@src/types/user";

export const savePayment = async(payment: IPayment, user: IUserDoc): Promise<IPaymentDoc> => {
    const payload = {
        ...payment,
        user: user._id.toString()
    }
    return new PaymentRepo().createPayment(payload);  
}

export const getPaymentPendingCountOfInstallments = async():Promise<Number> => {
    return new PaymentRepo().getPaymentPendingCountForInstallments();
}