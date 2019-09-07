const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const user = await req.context.models.User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }).catch((err) => {
        console.log(err.code);
        if(err.code === 11000) {
            return { errorMessage: "Username or email address already in use." };
        }
    });

    return res.send(user);
});


router.get('/', async (req, res) => {
    const users = await req.context.models.User.find();

    return res.send(users);
});

router.get('/:id', async (req, res) => {
    const user = await req.context.models.User.findById(req.params.id);

    return res.send(user);
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