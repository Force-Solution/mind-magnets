import Joi from 'joi';

export default {
  createClass: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    backgroundImg: Joi.string().optional(),
    logoImg: Joi.string().optional(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required(),
    students: Joi.array().items(Joi.string().email()).optional(),
    batch: Joi.string().required()
  }),
};
