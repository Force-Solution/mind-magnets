import { PaymentTypes } from '@src/types/payment';
import Joi from 'joi';

const paymentDetails = Joi.object().keys({
  amount: Joi.number().required().positive(),
  paid: Joi.boolean().required(),
  dueDate: Joi.date().required(),
});

export default {
  createPayment: Joi.object().keys({
    paymentType: Joi.string()
      .required()
      .valid(PaymentTypes.Installments, PaymentTypes.Lumpsum),
    payment: Joi.alternatives().try(
      paymentDetails,
      Joi.array().items(paymentDetails),
    ),
  }),
};
