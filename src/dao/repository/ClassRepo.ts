import mongoose from 'mongoose';

import { BadRequestError } from '@src/core/API_Handler/ApiError';
import Class from '@src/dao/model/class';

import { IClass, IClassDoc } from '@src/types/class';

export class ClassRepo {
  class: typeof Class;
  constructor(){
    this.class = Class;
  }
  public async isDuplicateClass(name: string): Promise<boolean> {
    return this.class.isClassPresent(name);
  }

  public async createClass(body: IClass): Promise<IClassDoc> {
    if (await this.isDuplicateClass(body.name)) {
      throw new BadRequestError('Duplicate class name is not allowed');
    }
    return this.class.create(body);
  }

  public async classesByTeacher(teacher: mongoose.Types.ObjectId): Promise<IClassDoc[] | null> {
    return this.class.find({teacher});
  }
}
