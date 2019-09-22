import { Schema, model } from 'mongoose';
import StringEntityReplacementService from '../services/StringEntityReplacementService';

const ticketSchema = new Schema({
    description: {
        type: String
    },
    creation: {
        type: Date
    },
    eta: {
        type: Date
    },
    completion: {
        type: Date
    },
    priority: {
        type: String
    },
    ticketType: {
        type: Schema.Types.ObjectId,
        ref: 'Type'
    },
    activity: [{
        type: Schema.Types.ObjectId,
        ref: 'Activity'
    }],
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    },
    status: {
        type: String
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    handler: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

ticketSchema.statics.resolveActivity = async function(activity, models) {
    return Promise.all(
        activity.map(async (x) => StringEntityReplacementService.replace(x, models))
    ).then((act) => {
        return act;
    });
}

export default model('Ticket', ticketSchema);
