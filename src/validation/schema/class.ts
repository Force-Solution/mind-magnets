import Joi from 'joi';

export default {
  createClass: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    backgroundImg: Joi.string().optional(),
    logoImg: Joi.string().optional(),
    startTime: Joi.string().optional(),
    endTime: Joi.string().optional(),
    students: Joi.array().items(Joi.string().email()).optional(),
    batch: Joi.string().required()
  }),
};
