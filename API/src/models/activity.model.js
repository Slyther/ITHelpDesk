import { Schema, model } from 'mongoose';

const activitySchema = new Schema({
    detail: {
        type: String,
        require: true
    },
    timestamp: {
        type: Date
    },
    ticket: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket'
    }
});

export default model('Activity', activitySchema);
