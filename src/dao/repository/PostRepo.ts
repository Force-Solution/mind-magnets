import { BadRequestError } from '@src/core/API_Handler/ApiError';
import Post from '@src/dao/model/post';
import { IPost, IPostDoc } from '@src/types/post';

export class PostRepo {
  public async isDuplicatePost(name: string): Promise<boolean> {
    return Post.isPostPresent(name);
  }

  public async createPost(body: IPost): Promise<IPostDoc> {
    if (await this.isDuplicatePost(body.name)) {
      throw new BadRequestError('Duplicate Post Name is not allowed');
    }
    return Post.create(body);
  }

  // public getBatchByName(batch: string): Promise<IBatchDoc | null>{
  //     return Batch.findOne({name: batch});
  // }
}
