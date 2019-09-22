const mongoose = require('mongoose');

require('dotenv').config({path: `${__dirname}\\environments\\${process.env.NODE_ENV.trim()}.env`})

const username = process.env.DBUSER;
const password = process.env.DBPASSWORD;
const server = process.env.DBSERVER;
const database = process.env.DBNAME;
const uri = `mongodb+srv://${username}:${password}@${server}/${database}?retryWrites=true&w=majority`;

const User = require('./models/user.model').default;

const models = { User };

const connectDb = () => {
    return mongoose.connect(uri, { useNewUrlParser: true });
}

export { connectDb };

export default models;