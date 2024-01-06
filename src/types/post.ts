import mongoose, { Model, Document } from 'mongoose';

export interface IPost {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostDoc extends IPost, Document {
  _id: mongoose.Types.ObjectId;
}
export interface IPostModel extends Model<IPostDoc> {
  isPostPresent(
    post: string,
    excludePostId?: mongoose.Types.ObjectId,
  ): Promise<boolean>;
}
