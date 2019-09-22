const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const type = await req.context.models.Type.create(req.body);

    return res.send(type);
});

router.get('/', async (req, res) => {
    const types = await req.context.models.Type.find({});

    return res.send(types);
});

router.get('/:id', async (req, res) => {
    const types = await req.context.models.Type.find({department: req.params.id});

    return res.send(types);
});

router.get('/type/:id', async (req, res) => {
    const types = await req.context.models.Type.findById(req.params.id);

    return res.send(types);
});

router.put('/:id', async (req, res) => {
    let updatedType = await req.context.models.Type.updateOne({_id: req.params.id}, req.body);
    
    return res.send(updatedType);
});

router.delete('/:id', async (req, res) => {
    const type = await req.context.models.Type.findById(req.params.id);
    let result = null;
    if(type) {
        result = await type.remove();
    }

    return res.send(result);
});

module.exports = router;