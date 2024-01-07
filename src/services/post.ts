import { PostRepo } from '@src/dao/repository/PostRepo';
import { IPost, IPostDoc } from '@src/types/post';

export const isPostPresentByName = async (post: string): Promise<boolean> => {
  return await new PostRepo().isDuplicatePost(post);
};

export const createPost = async (post: IPost): Promise<IPostDoc> => {
  return await new PostRepo().createPost(post);
};
