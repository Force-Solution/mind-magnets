import { BadRequestError } from '@src/core/API_Handler/ApiError';
import Post from '@src/dao/model/post';
import { IPost, IPostDoc } from '@src/types/post';
import { IRequest } from '@src/types/request';

export class PostRepo {
  post: typeof Post;

  constructor(){
    this.post = Post;
  }

  public async isDuplicatePost(name: string): Promise<boolean> {
    return this.post.isPostPresent(name);
  }

  public async createPost(body: IPost): Promise<IPostDoc> {
    if (await this.isDuplicatePost(body.post)) {
      throw new BadRequestError('Duplicate Post Name is not allowed');
    }
    return this.post.create(body);
  }

  public async getPostList(payload: Partial<IRequest>) {
    const data =  await this.post.find({})
      .skip(Number(payload.size) * (Number(payload.page)))
      .limit(Number(payload.size));
    const totalElements = await this.post.find({}).countDocuments();

    return {
        data: data,
        totalElements: totalElements ?? 0,
        totalPages: Math.ceil(
          totalElements / parseInt(payload.size ?? '0'),
        ),
      };
  }

  public async getPostFromName(post: string): Promise<IPostDoc | null>{
    return this.post.findOne({post});
  }

}
