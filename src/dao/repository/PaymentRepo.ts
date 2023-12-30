import { IPayment, IPaymentDoc, PaymentTypes } from '@src/types/payment';
import Payment from '@src/dao/model/payment';

export class PaymentRepo {
  public createPayment(payment: IPayment): Promise<IPaymentDoc> {
    return  Payment.create(payment);
  }

  public getPaymentPendingCountForInstallments(): Promise<Number> {
    return Payment.countDocuments({
      paymentType: PaymentTypes.Installments,
      'payment.paid': false,
      'payment.dueDate': { $lt: new Date() },
    });
  }
}
