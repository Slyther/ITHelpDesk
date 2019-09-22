const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
import models, { connectDb } from './database';

require('dotenv').config({path: `${__dirname}\\environments\\${process.env.NODE_ENV.trim()}.env`})

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use((req, res, next) => {
    req.context = {
        models
    };
    next();
});
app.use(session({
    secret: 'some dirty little secret',
    resave: false,
    saveUninitialized: false,
}));

const PORT = process.env.PORT || 5000;

const routes = ['users'];

routes.forEach(route => {
    app.use(`/api/${route}`, require(`./routes/api/${route}`));
});

const erasaDatabaseOnSync = process.env.DELETEDB;

connectDb().then(async () => {
    if(erasaDatabaseOnSync === 'true') {
        await Promise.all([
            models.User.deleteMany({}),
        ]);
    }
    app.listen(PORT, () => {
        console.log(`Express started on ${PORT}`);
    });
});

module.exports = app;