import { Schema, model } from 'mongoose';
import StringEntityReplacementService from '../services/StringEntityReplacementService';

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

activitySchema.statics.resolveActivity = async function(activity, models) {
    return Promise.all(
        activity.map(async (x) => StringEntityReplacementService.replace(x, models))
    ).then((act) => {
        return act;
    });
}

export default model('Activity', activitySchema);
