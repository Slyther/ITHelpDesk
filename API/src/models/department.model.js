import { Schema, model } from 'mongoose';

const departmentSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String
    }
});

export default model('Department', departmentSchema);
