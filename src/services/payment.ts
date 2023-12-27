import { PaymentRepo } from "@src/dao/repository/PaymentRepo";
import { IPayment, IPaymentDoc } from "@src/types/payment";
import { IUserDoc } from "@src/types/user";

export const savePayment = async(payment: IPayment, user: IUserDoc): Promise<IPaymentDoc> => {
    const payload = {
        ...payment,
        user: user._id.toString()
    }
    return await new PaymentRepo().createPayment(payload);  
}