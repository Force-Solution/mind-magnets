import { ITeacherDoc, ITeacherModel } from '@src/types/teacher';
import { Schema, model } from 'mongoose';

const schema = new Schema<ITeacherDoc, ITeacherModel>({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    department: {
        type:String,
        required:true,
        index:true,
        trim:true,
    },
    post:{
        type:String,
        required:true,
        index:true,
        trim:true,
    }
}, {timestamps: true});

const Teacher = model<ITeacherDoc, ITeacherModel>('Teacher', schema);

export default Teacher;