const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const department = await req.context.models.Department.create(req.body);

    return res.send(department);
});

router.get('/', async (req, res) => {
    const departments = await req.context.models.Department.find({});

    return res.send(departments);
});

router.get('/:id', async (req, res) => {
    const departments = await req.context.models.Department.findById(req.params.id);

    return res.send(departments);
});

router.put('/:id', async (req, res) => {
    let updatedDepartment = await req.context.models.Department.updateOne({_id: req.params.id}, req.body);
    
    return res.send(updatedDepartment);
});

router.delete('/:id', async (req, res) => {
    const department = await req.context.models.Department.findById(req.params.id);
    let result = null;
    if(department) {
        result = await department.remove();
    }

    return res.send(result);
});

module.exports = router;