import { Department, Post } from '@src/types/teacher';
import Joi from 'joi';

export default {
  createTeacher: Joi.object().keys({
    department: Joi.string().required().valid(Department.Biology, Department.Chemistry, Department.Mathematics, Department.Physics),
    post: Joi.string().required().valid(Post.AssitantProfessor, Post.Professor),
  }),
};
