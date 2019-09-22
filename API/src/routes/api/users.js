const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
    let validationResult = await req.context.models.User.validateNewUser(req.body);
    if (validationResult.length !== 0) {
        return res.json({ validationResult: validationResult });
    }
    let preparedUser = req.context.models.User.prepareSecretInfo(req.body);
    const user = await req.context.models.User.create(preparedUser);

    return res.status(200).send(user);
});

router.post('/login', async (req, res) => {
    let isValidLogin = await req.context.models.User.validateLogin(req.body);
    if (isValidLogin) {
        let user = await req.context.models.User.getUserByEmail(req.body.email);
        req.session.email = user.email;
        req.session.isLoggedIn = true;
        return res.send({active: user.active, email: user.email, username: user.username, id: user.id, role: user.role });
    }

    return res.send({"msg": "Incorrect login info."});
});

router.get('/login', async (req, res) => {
    if(req.session.isLoggedIn){
        let user = await req.context.models.User.getUserByEmail(req.session.email);
        return res.send({active: user.active, email: user.email, username: user.username, id: user.id, role: user.role });
    }
    return res.send({"msg": "Not logged in."});
});

router.get('/logout', async (req, res) => {
    req.session.destroy();
    return res.send({"msg": "success"});
});

router.get('/:id', async (req, res) => {
    const user = await req.context.models.User.findById(req.params.id);

    return res.send(user);
});

router.get('/', async (req, res) => {
    const users = await req.context.models.User.find({});
    const mappedUsers = users.map(user => {
        return {active: user.active, email: user.email, username: user.username, id: user.id, role: user.role };
    })

    return res.send(mappedUsers);
});

router.put('/:id', async (req, res) => {
    let updatedUser = await req.context.models.User.updateOne({_id: req.params.id}, req.body);
    
    return res.send(updatedUser);
});

router.delete('/:id', async (req, res) => {
    const user = await req.context.models.User.findById(req.params.id);
    let result = null;
    if(user) {
        result = await user.remove();
    }

    return res.send(result);
});

module.exports = router;