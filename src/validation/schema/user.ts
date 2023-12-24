import Joi, { StringSchema } from 'joi';
import { customMessages } from '@src/validation/util';
import { IRole } from '@src/types/roles';
import { passwordRegex } from '@src/helper/util';

const passwordValidation: StringSchema<string> = Joi.string()
  .required()
  .pattern(passwordRegex)
  .message(customMessages['string.password']);

const roleValidation: StringSchema<string> = Joi.string()
  .required()
  .valid([IRole.Admin, IRole.Teacher, IRole.Student, IRole.Parent])
  .message(customMessages['string.role']);

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
    userName: Joi.string().required().alphanum()
  }),
};
