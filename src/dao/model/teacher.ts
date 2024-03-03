import { ITeacherDoc, ITeacherModel } from '@src/types/teacher';
import { Schema, model } from 'mongoose';

const schema = new Schema<ITeacherDoc, ITeacherModel>({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    classes:{
        type: [Schema.Types.ObjectId],
        ref: 'Class',
        default: []
    },
    department: {
        type: Schema.Types.ObjectId,
        required:true,
        ref: "Department"
    },
    post:{
        type: Schema.Types.ObjectId,
        required:true,
        ref: "Post"
    }
}, {timestamps: true});

const Teacher = model<ITeacherDoc, ITeacherModel>('Teacher', schema);

export default Teacher;