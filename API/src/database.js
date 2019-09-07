const mongoose = require('mongoose');

const username = 'HelpDeskDirect';
const password = 'dKpH5pnGSjQMXv7l';
const server = 'cluster0-sjxrw.mongodb.net';
const database = 'ITHD';
const uri = `mongodb+srv://${username}:${password}@${server}/${database}?retryWrites=true&w=majority`;

const User = require('./models/user.model');

const models = { User };

const connectDb = () => {
    return mongoose.connect(uri, { useNewUrlParser: true });
}

export { connectDb };

export default models;