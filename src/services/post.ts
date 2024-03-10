import { PostRepo } from '@src/dao/repository/PostRepo';

import { IPost, IPostDoc } from '@src/types/post';
import { IRequest } from '@src/types/request';
import { TYPES } from '@src/types/types';
import { injectable, inject } from 'inversify';
@injectable()
export class PostService {
  constructor(@inject(TYPES.PostRepo) private post: PostRepo) {}

  public async isPostPresentByName(post: string): Promise<boolean> {
    return await this.post.isDuplicatePost(post);
  }

  public async createPost(post: IPost): Promise<IPostDoc> {
    return await this.post.createPost(post);
  }

  public async postList(payload: Partial<IRequest>) {
    return await this.post.getPostList(payload);
  }

  public async getPostFromName(post: string): Promise<IPostDoc | null> {
    return await this.post.getPostFromName(post);
  }
}
