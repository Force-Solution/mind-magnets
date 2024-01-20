import Joi, { StringSchema } from 'joi';
import { customMessages } from '@src/validation/util';
import { IRole } from '@src/types/roles';
import { passwordRegex } from '@src/helper/util';
// import student from './student';

const passwordValidation: StringSchema<string> = Joi.string()
  .optional()
  .pattern(passwordRegex)
  .message(customMessages['string.password']);

const roleValidation: StringSchema<string> = Joi.string()
  .required()
  .valid(IRole.Admin, IRole.Teacher, IRole.Student, IRole.Parent);
// .message(customMessages['string.role'])

export default {
  credential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: passwordValidation,
  }),
  createUser: Joi.object().keys({
    email: Joi.string().required().email(),
    password: passwordValidation,
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: roleValidation,
    userName: Joi.string().required().alphanum(),
  }),
  logout: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
  auth: Joi.object()
    .keys({
      authorization: Joi.string()
        .required()
        .pattern(/^Bearer\s+\S+$/),
    })
    .unknown(true), // remove this as security descreases
  params: Joi.object().keys({
    page: Joi.number().min(1),
    size: Joi.number().min(1),
    sort: Joi.string().optional(),
    search: Joi.string().optional(),
    order: Joi.string(),
    filter: Joi.string(),
  }),
  signup: Joi.object().keys({
    email: Joi.string().required().email(),
    password: passwordValidation,
    token: Joi.string().required()
  })
};
