const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    let activity = await req.context.models.Activity.create({timestamp: new Date().getTime(), ...req.body});

    activity = await req.context.models.Activity.resolveActivity([activity], req.context.models);

    return res.send(activity);
});

router.get('/:id', async (req, res) => {
    let activities = await req.context.models.Activity.find({ticket: req.params.id});

    activities = await req.context.models.Activity.resolveActivity(activities, req.context.models);

    return res.send(activities.reverse());
});

router.get('/activity/:id', async (req, res) => {
    let activity = await req.context.models.Activity.findById(req.params.id);

    activity = await req.context.models.Activity.resolveActivity([activity], req.context.models);

    return res.send(activity);
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