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

const routes = ['users', 'activities', 'departments', 'tickets', 'types'];

routes.forEach(route => {
    app.use(`/api/${route}`, require(`./routes/api/${route}`));
});

const erasaDatabaseOnSync = process.env.DELETEDB;
const createSeedsOnSync = process.env.CREATEDBSEEDS;

connectDb().then(async () => {
    if(erasaDatabaseOnSync === 'true') {
        await Promise.all([
            models.User.deleteMany({}),
            models.Type.deleteMany({}),
            models.Ticket.deleteMany({}),
            models.Department.deleteMany({}),
            models.Activity.deleteMany({}),
        ]);
    }
    if(createSeedsOnSync === 'true') {
        await createSeeds();
    }
    app.listen(PORT, () => {
        console.log(`Express started on ${PORT}`);
    });
});

const createSeeds = async () => {
    let admin = new models.User({
        username: "Admin",
        email: "admin@ithd.com",
        password: "administrator",
        role: 'admin'
    });

    let tech1 = new models.User({
        username: "Tech1",
        email: "tech1@ithd.com",
        password: "technician",
        role: 'tech'
    });

    let tech2 = new models.User({
        username: "Tech2",
        email: "tech2@ithd.com",
        password: "technician",
        role: 'tech'
    });

    let tech3 = new models.User({
        username: "Tech3",
        email: "tech3@ithd.com",
        password: "technician",
        role: 'tech'
    });

    let user1 = new models.User({
        username: "User1",
        email: "user1@ithd.com",
        password: "normaluser",
        role: 'user'
    });

    let user2 = new models.User({
        username: "User2",
        email: "user2@ithd.com",
        password: "normaluser",
        role: 'user'
    });

    let user3 = new models.User({
        username: "User3",
        email: "user3@ithd.com",
        password: "normaluser",
        role: 'user'
    });

    let department1 = new models.Department({
        name: 'IT Helpdesk',
        description: 'Technical assistance'
    });

    let department2 = new models.Department({
        name: 'Support',
        description: 'Technical assistance and support'
    });

    let department3 = new models.Department({
        name: 'Wintel',
        description: 'Build, configure, assess, recommend hardware and software'
    });

    let department4 = new models.Department({
        name: 'Communications',
        description: 'Assistance and configure in communications'
    });

    let department5 = new models.Department({
        name: 'Infraestructure',
        description: 'Configure and install all hardware'
    });

    let department6 = new models.Department({
        name: 'DBA',
        description: 'DataBase Administrators'
    });

    let type1 = new models.Type({
        name: 'Application',
        department: department1.id,
        description: 'Assistance',
        priority: 'Very High',
        eta: '4h'
    });

    let type2 = new models.Type({
        name: 'Software',
        department: department1.id,
        description: 'Software Assitance',
        priority: 'Low',
        eta: '3d'
    });

    let type3 = new models.Type({
        name: 'Printers',
        department: department2.id,
        description: 'Printer Assistance',
        priority: 'Medium',
        eta: '2d'
    });

    let type4 = new models.Type({
        name: 'Software Install',
        department: department2.id,
        description: 'New software installation',
        priority: 'High',
        eta: '1d'
    });

    let type5 = new models.Type({
        name: 'Active Directory',
        department: department3.id,
        description: 'Reset/Unlock Account',
        priority: 'High',
        eta: '1d'
    });

    let type6 = new models.Type({
        name: 'Telephony',
        department: department4.id,
        description: 'Telelphone assistance/Telephone failures',
        priority: 'High',
        eta: '12h'
    });

    let type7 = new models.Type({
        name: 'Email',
        department: department4.id,
        description: 'Email configuration',
        priority: 'High',
        eta: '12h'
    });

    let type8 = new models.Type({
        name: 'Hardware',
        department: department5.id,
        description: 'Hardware assistance',
        priority: 'High',
        eta: '12h'
    });

    let type9 = new models.Type({
        name: 'Network',
        department: department5.id,
        description: 'Network connection assistance',
        priority: 'High',
        eta: '12h'
    });

    let type10 = new models.Type({
        name: 'Purchase',
        department: department5.id,
        description: 'Purchase and new equipment',
        priority: 'High',
        eta: '12h'
    });

    let type11 = new models.Type({
        name: 'Hardware Install',
        department: department5.id,
        description: 'New equipment installation',
        priority: 'High',
        eta: '12h'
    });

    let type12 = new models.Type({
        name: 'Database',
        department: department6.id,
        description: 'Database Assistance',
        priority: 'High',
        eta: '12h'
    });

    admin = models.User.prepareSecretInfo(admin);
    tech1 = models.User.prepareSecretInfo(tech1);
    tech2 = models.User.prepareSecretInfo(tech2);
    tech3 = models.User.prepareSecretInfo(tech3);
    user1 = models.User.prepareSecretInfo(user1);
    user2 = models.User.prepareSecretInfo(user2);
    user3 = models.User.prepareSecretInfo(user3);

    await department1.save();
    await department2.save();
    await department3.save();
    await department4.save();
    await department5.save();
    await department6.save();

    await type1.save();
    await type2.save();
    await type3.save();
    await type4.save();
    await type5.save();
    await type6.save();
    await type7.save();
    await type8.save();
    await type9.save();
    await type10.save();
    await type11.save();
    await type12.save();

    await admin.save();
    await tech1.save();
    await tech2.save();
    await tech3.save();
    await user1.save();
    await user2.save();
    await user3.save();
}

module.exports = app;