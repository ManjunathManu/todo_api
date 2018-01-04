const express = require('express');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

let router = express.Router();
let {authenticate} = require('./../middleware/authenticate');
let {Todo} = require('./../models/todo');


router.post('/', authenticate, (req, res) => {
    var todo = new Todo({
      text: req.body.text,
      _creator:req.user._id
    });
  
    todo.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    });
});
  
router.get('/', authenticate, (req, res) => {
    Todo.find({_creator:req.user._id}).then((todos) => {
      res.send({todos});
    }, (e) => {
      res.status(400).send(e);
    });
});
  
router.get('/:id',authenticate, (req, res) => {
    var id = req.params.id;
  
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
  
    Todo.findOne({_id:id, _creator:req.user._id}).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
  
      res.send({todo});
    }).catch((e) => {
      res.status(404).send();
    });
});
  
router.post('/findId', authenticate, (req, res)=>{
    var text = req.body.text;
    if(text === " "){
      return res.status(404).send();
    }
    Todo.findOne({text, _creator:req.user._id}).then((todo)=>{
      if(!todo){
        return res.status(404).send();
      }
      res.send(todo._id);
    }).catch((e)=>{
      res.status(404).send();
    });
});
  
router.delete('/:id',authenticate, (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
  
    Todo.findOneAndRemove({_id:id, _creator:req.user._id}).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
  
      res.send({todo});
    }).catch((e) => {
      res.status(404).send();
    });
});
  
router.patch('/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
  
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
  
    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }
  
    Todo.findOneAndUpdate({_id:id, _creator:req.user._id}, {$set: body}, {new: true}).then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }
  
      res.send({todo});
    }).catch((e) => {
      res.status(404).send();
    })
});
  
router.post('/search', authenticate, (req, res)=>{
     var text = req.body.text;
     var todosText =[];
     if(text === " "){
      return res.status(404).send();
    }
    Todo.find({"text": new RegExp(text, 'i'), _creator:req.user._id}).then((todos)=>{
        if(!todos.length){
          return res.status(404).send();
        }
        
        todos.forEach((todo)=>{
          // todosText.push(todo.text);
          todoSubObj={}
          todoSubObj.text = todo.text;
          todoSubObj.completed = todo.completed;
          todosText.push(todoSubObj);
        })
        res.send(todosText);
    }).catch((e)=>{
      res.status(404).send();
    })
});

module.exports = router;