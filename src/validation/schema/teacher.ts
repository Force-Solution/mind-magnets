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
  })
};
