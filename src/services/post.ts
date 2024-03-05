import { PostRepo } from '@src/dao/repository/PostRepo';
import { IPost, IPostDoc } from '@src/types/post';
import { IRequest } from '@src/types/request';

export const isPostPresentByName = async (post: string): Promise<boolean> => {
  return await new PostRepo().isDuplicatePost(post);
};

export const createPost = async (post: IPost): Promise<IPostDoc> => {
  return await new PostRepo().createPost(post);
};

export const postList = async(payload: Partial<IRequest>) => {
  return await new PostRepo().getPostList(payload);
}

export const getPostFromName = async (post: string): Promise<IPostDoc | null> => {
  return await new PostRepo().getPostFromName(post);
}