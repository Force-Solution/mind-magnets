import { PaymentTypes } from '@src/types/payment';
import Joi from 'joi';

export default {
  createPayment: Joi.object().keys({
    paymentType: Joi.string().required()
      .valid(PaymentTypes.Installments, PaymentTypes.Lumpsum),
    payment: Joi.alternatives().try(
      Joi.array().items(
        Joi.object().keys({
          amount: Joi.number().required().positive(),
          paid: Joi.boolean().required(),
          dueDate: Joi.date().required(),
        }),
      ),
      Joi.object().keys({
        amount: Joi.number().required().positive(),
        paid: Joi.boolean().required(),
      }),
    ),
  }),
};
