import { Schema, model } from 'mongoose';

export interface IAutoIncrement{
    _id: string,
    seq: number
}

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