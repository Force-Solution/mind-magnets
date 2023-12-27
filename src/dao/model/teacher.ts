import { Department, ITeacherDoc, ITeacherModel, Post } from '@src/types/teacher';
import { Schema, model } from 'mongoose';

const schema = new Schema<ITeacherDoc, ITeacherModel>({
    user:{
        type: String,
        ref: 'User',
        required: true,
    },
    department: {
        type:String,
        required:true,
        index:true,
        trim:true,
        enum: [Department.Physics, Department.Chemistry, Department.Mathematics, Department.Biology]
    },
    post:{
        type:String,
        required:true,
        index:true,
        trim:true,
        enum: [Post.Professor, Post.AssitantProfessor]
    }
}, {timestamps: true});

const Teacher = model<ITeacherDoc, ITeacherModel>('Teacher', schema);

export default Teacher;