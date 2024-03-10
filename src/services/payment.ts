import { PaymentRepo } from '@src/dao/repository/PaymentRepo';
import { IPayment, IPaymentDoc } from '@src/types/payment';
import { TYPES } from '@src/types/types';
import { inject, injectable } from 'inversify';
@injectable()
export class PaymentService {
  constructor(@inject(TYPES.PaymentRepo) private payment: PaymentRepo) {}
  public async savePayment(payment: IPayment): Promise<IPaymentDoc> {
    return this.payment.createPayment(payment);
  }

  public async getPaymentPendingCountByType(type: string): Promise<Number> {
    return this.payment.getPaymentPendingCountByType(type);
  }
}
