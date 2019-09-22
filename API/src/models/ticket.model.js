import { Schema, model } from 'mongoose';

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

export default model('Ticket', ticketSchema);
