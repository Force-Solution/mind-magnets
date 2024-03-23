import Joi from 'joi';

export default {
  createClass: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    backgroundImg: Joi.string().allow('').optional(),
    logoImg: Joi.string().allow('').optional(),
    startTime: Joi.string().optional(),
    endTime: Joi.string().optional(),
    students: Joi.array().allow(...[]).items(Joi.string().email()).optional(),
    batch: Joi.string().required()
  }),
};
