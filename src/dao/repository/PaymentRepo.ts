import { IPayment, IPaymentDoc, PaymentTypes } from '@src/types/payment';
import Payment from '@src/dao/model/payment';

export class PaymentRepo {
  public async createPayment(payment: IPayment): Promise<IPaymentDoc> {
    return await Payment.create(payment);
  }

  public async getPaymentPendingCountForInstallments(): Promise<number> {
    return await Payment.countDocuments({
      paymentType: PaymentTypes.Installments,
      'payment.paid': false,
      'payment.dueDate': { $lt: new Date() },
    });
  }
}
