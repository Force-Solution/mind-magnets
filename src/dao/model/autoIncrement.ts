import { Schema, model } from 'mongoose';
import { IAutoIncrement } from '@src/types/autoIncrement';

const schema = new Schema<IAutoIncrement>({
    _id:{
        type: String,
        required: true
    },
    seq:{
        type: Number,
        default: 0
    }
});

const AutoIncrement = model<IAutoIncrement>('AutoIncrement',schema);

export default AutoIncrement;