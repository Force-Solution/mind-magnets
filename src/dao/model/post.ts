import { IPostDoc, IPostModel } from '@src/types/post';
import mongoose, { Schema, model } from 'mongoose';

const schema = new Schema<IPostDoc, IPostModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
  },
  { timestamps: true },
);

schema.statics.isPostPresent = async function (post: string, excludePostId: mongoose.ObjectId) {
    return !!await this.findOne({ post, _id: { $ne: excludePostId } });
  }

const Post = model<IPostDoc, IPostModel>('Post', schema);

export default Post;
