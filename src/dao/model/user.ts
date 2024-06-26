import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import { IRole } from '@src/types/roles';
import { saltHashRounds } from '@src/config/configManager';
import AutoIncrement from '@src/dao/model/autoIncrement';
import { IUserDoc, IUserModel } from '@src/types/user';
import { validateEmail } from '@src/helper/util';


const schema = new Schema<IUserDoc, IUserModel>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: Number,
      index: true,
      unique: true,
    },
    userName: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      index: true,
      enum: [IRole.Admin, IRole.Teacher, IRole.Student, IRole.Parent]
    },
    profileUrl: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      trim: true,
      validate:{
        validator: (value:string) => validateEmail(value),
        message: (props) => `${props.value} is not a valid email!`
      }
    },
    isEmailVerified:{
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

schema.statics.isEmailTaken = async function (email: string, excludeUserId: mongoose.ObjectId) {
  return !!await this.findOne({ email, _id: { $ne: excludeUserId } });
}

schema.methods.isPasswordMatch = async function(password:string){
  return bcrypt.compare(password, this.password);
};

schema.pre('save', async function(next){
  if(this.isModified('password')){
    const saltRounds:number = parseInt(saltHashRounds || '8');
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  if(this.isNew){
    const data = await AutoIncrement.findOneAndUpdate(
      {_id: 'userId'},
      {$inc: { seq: 1 }},
      { upsert: true, new: true },
    );
    this.userId = data.seq;
  }
  next();
});

const User = model<IUserDoc, IUserModel>('User', schema);

export default User;
