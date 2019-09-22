const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const ticket = await req.context.models.Ticket.create(req.body);
    ticket.activity = await req.context.models.Ticket.resolveActivity(ticket.activity, req.context.models);

    return res.send(ticket);
});

router.get('/:id', async (req, res) => {
    const tickets = await req.context.models.Ticket.find($or[{creator: req.params.id}, {handler: req.params.id}]).populate('activity');
    Promise.all(
        tickets.map(async ticket => {
            ticket.activity = await req.context.models.Ticket.resolveActivity(ticket.activity, req.context.models);
            return ticket;
        })
    ).then((tickets) => {
        return res.send(tickets);
    });
});

router.get('/ticket/:id', async (req, res) => {
    const tickets = await req.context.models.Ticket.findById(req.params.id).populate('activity');
    tickets.activity = await req.context.models.Ticket.resolveActivity(tickets.activity, req.context.models);

    return res.send(tickets);
});

router.put('/:id', async (req, res) => {
    let updatedCard = await req.context.models.Ticket.updateOne({_id: req.params.id}, req.body);
    
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