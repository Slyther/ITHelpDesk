const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const ticket = await req.context.models.Ticket.create({creation: new Date(),...req.body});

    return res.send(ticket);
});

router.get('/:id', async (req, res) => {
    const tickets = await req.context.models.Ticket.find({$or: [{creator: req.params.id}, {handler: req.params.id}]});
    return res.send(tickets);
});

router.get('/own/:id', async (req, res) => {
    const tickets = await req.context.models.Ticket.find({creator: req.params.id});
    return res.send(tickets);
});

router.get('/assigned/:id', async (req, res) => {
    const tickets = await req.context.models.Ticket.find({handler: req.params.id});
    return res.send(tickets);
});

router.get('/unassigned/:id', async (req, res) => {
    const tickets = await req.context.models.Ticket.find({handler: null});
    return res.send(tickets);
});

router.get('/allassigned/:id', async (req, res) => {
    const tickets = await req.context.models.Ticket.find({handler: {$ne: null}});
    return res.send(tickets);
});

router.get('/ticket/:id', async (req, res) => {
    const tickets = await req.context.models.Ticket.findById(req.params.id);

    return res.send(tickets);
});

router.put('/:id', async (req, res) => {
    let card = await req.context.models.Ticket.findById(req.params.id);
    let updatedCard;

    if(req.body.status === 'Closed' && card.status !== 'Closed') {
        updatedCard = await req.context.models.Ticket.updateOne({_id: req.params.id}, {completion: new Date(),...req.body});
    }else {
        updatedCard = await req.context.models.Ticket.updateOne({_id: req.params.id}, req.body);
    }
    
    return res.send(updatedCard);
});

router.delete('/:id', async (req, res) => {
    const ticket = await req.context.models.Ticket.findById(req.params.id);
    let result = null;
    if(ticket) {
        result = await ticket.remove();
    }

    return res.send(result);
});

module.exports = router;