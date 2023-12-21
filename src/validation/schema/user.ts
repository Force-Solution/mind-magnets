import Joi from 'joi';

/**
 * todo password check kar ek Upper 1 number  1 special orr baki small case length min -> 8
 * * role jo Irole hai usme se hi hona chaiye
 * * give proper validation msg
 * * write Quality code
 */
export default {
  credential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
  createUser: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().required(),
    userName: Joi.string().required().alphanum()
  }),
};
