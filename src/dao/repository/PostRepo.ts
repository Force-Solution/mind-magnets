import { BadRequestError } from '@src/core/API_Handler/ApiError';
import Post from '@src/dao/model/post';
import { IPost, IPostDoc } from '@src/types/post';
import { IRequest } from '@src/types/request';

export class PostRepo {
  public async isDuplicatePost(name: string): Promise<boolean> {
    return Post.isPostPresent(name);
  }

  public async createPost(body: IPost): Promise<IPostDoc> {
    if (await this.isDuplicatePost(body.post)) {
      throw new BadRequestError('Duplicate Post Name is not allowed');
    }
    return Post.create(body);
  }

  public async getPostList(payload: Partial<IRequest>) {
    const data =  await Post.find({})
      .skip(Number(payload.size) * (Number(payload.page)))
      .limit(Number(payload.size));
    const totalElements = await Post.find({}).countDocuments();

    return {
        data: data,
        totalElements: totalElements ?? 0,
        totalPages: Math.ceil(
          totalElements / parseInt(payload.size ?? '0'),
        ),
      };
  }

  public async getPostFromName(post: string): Promise<IPostDoc | null>{
    return Post.findOne({post});
  }

  // public getBatchByName(batch: string): Promise<IBatchDoc | null>{
  //     return Batch.findOne({name: batch});
  // }
}
