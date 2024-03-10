import { PaymentRepo } from '@src/dao/repository/PaymentRepo';
import { IPayment, IPaymentDoc } from '@src/types/payment';

export class PaymentService {
  payment: PaymentRepo;
  constructor() {
    this.payment = new PaymentRepo();
  }
  public async savePayment(payment: IPayment): Promise<IPaymentDoc> {
    return this.payment.createPayment(payment);
  }

  public async getPaymentPendingCountByType(type: string): Promise<Number> {
    return this.payment.getPaymentPendingCountByType(type);
  }
}
