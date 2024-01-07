import { IPayment, IPaymentDoc } from '@src/types/payment';
import Payment from '@src/dao/model/payment';

export class PaymentRepo {
  public createPayment(payment: IPayment): Promise<IPaymentDoc> {
    return  Payment.create(payment);
  }

  public getPaymentPendingCountByType(type: string): Promise<Number> {
    return Payment.countDocuments({
      paymentType: type,
      'payment.paid': false,
      'payment.dueDate': { $lt: new Date() },
    });
  }
}
