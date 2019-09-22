import { Schema, model } from 'mongoose';

const typeSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    department: {
        type: Schema.Types.ObjectId, 
        ref: 'Department' 
    },
    description: {
        type: String
    },
    priority: { 
        type: String 
    },
    eta: {
        type: String
    }
});

export default model('Type', typeSchema);
