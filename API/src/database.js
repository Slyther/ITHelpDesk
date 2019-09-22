const mongoose = require('mongoose');

require('dotenv').config({path: `${__dirname}\\environments\\${process.env.NODE_ENV.trim()}.env`})

const username = process.env.DBUSER;
const password = process.env.DBPASSWORD;
const server = process.env.DBSERVER;
const database = process.env.DBNAME;
const uri = `mongodb+srv://${username}:${password}@${server}/${database}?retryWrites=true&w=majority`;

const User = require('./models/user.model').default;
const Type = require('./models/type.model').default;
const Ticket = require('./models/ticket.model').default;
const Department = require('./models/department.model').default;
const Activity = require('./models/activity.model').default;

const models = { User, Type, Ticket, Department, Activity };

const connectDb = () => {
    return mongoose.connect(uri, { useNewUrlParser: true });
}

export { connectDb };

export default models;