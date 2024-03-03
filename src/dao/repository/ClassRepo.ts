import { IClass, IClassDoc } from '@src/types/class';
import Class from '../model/class';
import { BadRequestError } from '@src/core/API_Handler/ApiError';

export class ClassRepo {
  public async isDuplicateClass(name: string): Promise<boolean> {
    return Class.isClassPresent(name);
  }

  public async createClass(body: IClass): Promise<IClassDoc> {
    if (await this.isDuplicateClass(body.name)) {
      throw new BadRequestError('Duplicate class name is not allowed');
    }
    return Class.create(body);
  }
}
