import Joi, { StringSchema } from 'joi';
enum IRole {
  Admin = 'admin',
  Teacher = 'teacher',
  Student = 'student',
  Parent = 'parent',
}

const passwordRegex: RegExp =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const customMessages: Record<string, string> = {
  'string.pattern.base':
    'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and minimum length of 8.',
  'any.only': 'Invalid role. Please provide a valid role from IRole enum.',
};

const passwordValidation: StringSchema<string> = Joi.string()
  .required()
  .pattern(passwordRegex)
  .message(customMessages['string.pattern.base']);

const roleValidation: StringSchema<string> = Joi.string()
  .valid(...Object.values(IRole))
  .message(customMessages['any.only']);

export default {
  credential: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .messages({ ...customMessages }),
    password: passwordValidation,
  }),
  createUser: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .messages({ ...customMessages }),
    password: passwordValidation,
    firstName: Joi.string()
      .required()
      .messages({ ...customMessages }),
    lastName: Joi.string()
      .required()
      .messages({ ...customMessages }),
    role: roleValidation,
    userName: Joi.string()
      .required()
      .alphanum()
      .messages({ ...customMessages }),
  }),
};
