import { IPayment, IPaymentDoc } from '@src/types/payment';
import Payment from '@src/dao/model/payment';

export class PaymentRepo {
  payment: typeof Payment;

  constructor(){
    this.payment = Payment;
  }

  public createPayment(payment: IPayment): Promise<IPaymentDoc> {
    return  this.payment.create(payment);
  }

  public getPaymentPendingCountByType(type: string): Promise<Number> {
    return this.payment.countDocuments({
      paymentType: type,
      'payment.paid': false,
      'payment.dueDate': { $lt: new Date() },
    });
  }
}
