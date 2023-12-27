import Joi from 'joi';

export default {
  createStudent: Joi.object().keys({
    batch: Joi.string().required(),
    address: Joi.object({
      location: Joi.string().required().trim(),
      state: Joi.string().required().trim(),
      zip: Joi.number().required(),
    }).required(),
    parentName: Joi.string().required(),
    parentEmail: Joi.string().required().email(),
  }),
};
