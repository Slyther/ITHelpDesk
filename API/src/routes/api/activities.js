const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const activity = await req.context.models.Activity.create({timestamp: new Date().getTime(), ...req.body});

    return res.send(activity);
});

router.get('/:id', async (req, res) => {
    const activities = await req.context.models.Activity.find({ticket: req.params.id});

    return res.send(activities);
});

router.get('/activity/:id', async (req, res) => {
    const activities = await req.context.models.Activity.findById(req.params.id);

    return res.send(activities);
});

router.put('/:id', async (req, res) => {
    let updatedActivity = await req.context.models.Activity.updateOne({_id: req.params.id}, req.body);
    
    return res.send(updatedActivity);
});

router.delete('/:id', async (req, res) => {
    const activity = await req.context.models.Activity.findById(req.params.id);
    let result = null;
    if(activity) {
        result = await activity.remove();
    }

    return res.send(result);
});

module.exports = router;