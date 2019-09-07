const express = require('express');
const app = express();
const cors = require('cors');
import models, { connectDb } from './database';

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.options('*', cors());
app.use(cors());
app.use((req, res, next) => {
    req.context = {
        models
    };
    next();
});

const PORT = process.env.PORT || 5000;

const routes = ['users'];

routes.forEach(route => {
    app.use(`/api/${route}`, require(`./routes/api/${route}`));
});

const erasaDatabaseOnSync = true;

connectDb().then(async () => {
    if(erasaDatabaseOnSync) {
        await Promise.all([
            models.User.deleteMany({}),
        ]);

        createSeeds();
    }
    app.listen(PORT, () => {
        console.log(`Express started on ${PORT}`);
    });
});

const createSeeds = async () => {
    const user = new models.User({
        username: "TestUser",
        email: "test@user.com",
        password: "testpassword"
    });

    await user.save();
}

module.exports = app;