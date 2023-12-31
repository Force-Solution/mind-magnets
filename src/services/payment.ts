import { PaymentRepo } from "@src/dao/repository/PaymentRepo";
import { IPayment, IPaymentDoc } from "@src/types/payment";
import { IStudentDoc } from "@src/types/student";

export const savePayment = async(payment: IPayment, student: IStudentDoc): Promise<IPaymentDoc> => {
    const payload = {
        ...payment,
        student: student._id.toString()
    }
    return new PaymentRepo().createPayment(payload);  
}

export const getPaymentPendingCountOfInstallments = async():Promise<Number> => {
    return new PaymentRepo().getPaymentPendingCountForInstallments();
}