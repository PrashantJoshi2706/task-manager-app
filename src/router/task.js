const express = require('express');
const Task = require('../models/tasks');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/tasks',auth, async (req, res)=>{
    //const newTask = new Task(req.body);
    const newTask = new Task({
        ...req.body,
        Owner: req.user._id
    })
    try{
        await newTask.save();
        res.status(201).send(newTask);
    }
    catch (e) {
        res.status(400).send(e);
    }

})

router.get('/tasks',auth, async (req, res)=>{
    const match = {}
    if(req.query.complete){
        match.Complete = req.query.complete === 'true'
    }
    const sort = {}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'?-1:1;
    }
    try{
        const task = await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        //const task = await Task.find({Owner: req.user._id, Complete: req.query.Completed});
        if(!task){
            res.status(404).send();
        }
        res.send(task.tasks);
    }
    catch (e){
        res.status(500).send(e);
    }
});

router.get('/task/:id',auth, async (req, res)=>{
    const _id  = req.params.id;

    try{
       // const task = await Task.findById(_id);
        const task = await Task.findOne({_id, Owner: req.user._id});
        if(!task){
            res.status(404).send();
        }
        res.send(task);
    }
    catch (e){
        res.status(500).send(e);
    }
});

router.patch('/task/:id', auth, async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['Description', 'Complete'];
    const isValidOperation = updates.every((ele)=> allowedUpdates.includes(ele));
    if(!isValidOperation){
        return res.status(404).send({error: 'invalid Operation'});
    }

    try{
        //const task = await Task.findById(_id);
        const task = await Task.findOne({_id: req.params.id, Owner: req.user._id});
        //const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
        if(!task){
            res.status(404).send({error: 'something wrong'});
        }
        updates.forEach(element => task[element]=req.body[element]);
        await task.save();
        res.send(task);
    }
    catch(e){
        res.status(500).send(e);
    }
});

router.delete('/task/:id', auth, async (req, res)=>{
    try{
        //const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findByIdAndDelete({_id: req.params.id, Owner: req.user._id})
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }
    catch(e){
        res.status(500).send(e);
    }
})

module.exports = router;