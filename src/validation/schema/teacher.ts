import Joi from 'joi';

export default {
  createTeacher: Joi.object().keys({
    department: Joi.string().required(),
    post: Joi.string().required(),
  }),
  createPost: Joi.object().keys({
    post: Joi.string().required(),
  }),
  createDepartment: Joi.object().keys({
    department: Joi.string().required()
  }),
  createBatch: Joi.object().keys({
    name: Joi.string().required()
  }),
  createClass: Joi.object().keys({
    name: Joi.string().required(),
    batch: Joi.string().required(),
    startTime: Joi.string().required(),
    endTime: Joi.string().required()
  })
};
