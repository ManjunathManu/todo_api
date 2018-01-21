const express = require('express');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

let router = express.Router();
let {authenticate} = require('./../middleware/authenticate');
let {Todo} = require('./../models/todo');


router.post('/', authenticate, (req, res) => {
    var todo = new Todo({
      text: req.body.text,
      _creator:req.user[0]._id
    });
    todo.save((err)=>{
      if(err)
        res.status(400).send(err);
        else
        res.send(todo);
    })
    // todo.save().then((doc) => {
    //   res.send(doc);
    // }, (e) => {
    //   res.status(400).send(e);
    // });
});
  
router.get('/', authenticate, (req, res) => {

    Todo.find({_creator:req.user[0]._id},(err, todos)=>{
      if(err)
      res.status(400).send(err);
      else
      res.send(todos);
    })
});
  
router.get('/:id',authenticate, (req, res) => {
    var id = req.params.id;
  
    // if (!ObjectID.isValid(id)) {
    //   return res.status(404).send();
    // }
    
    Todo.find({_id:id, _creator:req.user[0]._id}, (err, todo)=>{
      if(err)
      res.status(400).send();
      else{
        if(!todo.length)
        res.status(404).send();
      }
      res.send(todo)
    })
    // Todo.findOne({_id:id, _creator:req.user._id}).then((todo) => {
    //   if (!todo) {
    //     return res.status(404).send();
    //   }
  
    //   res.send({todo});
    // }).catch((e) => {
    //   res.status(404).send();
    // });
});
  
router.post('/findId', authenticate, (req, res)=>{
    var text = req.body.text;
    if(text === " "){
      return res.status(404).send();
    }

    Todo.find({text, _creator:req.user[0]._id}, (err, todo)=>{
      if(!todo.length)
      res.status(404).send();
      else
      res.send(todo[0]._id);
    })
    // Todo.findOne({text, _creator:req.user._id}).then((todo)=>{
    //   if(!todo){
    //     return res.status(404).send();
    //   }
    //   res.send(todo._id);
    // }).catch((e)=>{
    //   res.status(404).send();
    // });
});
  
router.delete('/:id',authenticate, (req, res) => {
    var id = req.params.id;
    // if (!ObjectID.isValid(id)) {
    //   return res.status(404).send();
    // }
  
    // Todo.findOneAndRemove({_id:id, _creator:req.user._id}).then((todo) => {
    //   if (!todo) {
    //     return res.status(404).send();
    //   }
  
    //   res.send({todo});
    // }).catch((e) => {
    //   res.status(404).send();
    // });
    Todo.find({_id:id, _creator:req.user[0]._id}, (err, todo)=>{
      if(err)
        res.status(404).send();
      else{
        todo[0].remove((err)=>{
          if(err)
          res.status(404).send();
          res.send(todo[0]);
        })
        }
    })
});
  
router.patch('/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
  
    // if (!ObjectID.isValid(id)) {
    //   return res.status(404).send();
    // }
  

    Todo.find({_id:id, _creator:req.user[0]._id}, (err, todo)=>{
      if(!todo.length)
      res.status(404).send();
      else{
        if (_.isBoolean(body.completed) && body.completed) {
          todo[0].text = body.text;
          todo[0].completed = true;
          todo[0].completedAt = new Date().getTime();
        } else {
          todo[0].text = body.text;
          todo[0].completed = false;
          todo[0].completedAt = null;
        }
        todo[0].save((err)=>{
          if(err)
          res.status(404).send();
          else
          res.send(todo[0]);
        });
      }
    })
    // Todo.findOneAndUpdate({_id:id, _creator:req.user._id}, {$set: body}, {new: true}).then((todo) => {
    //   if (!todo) {
    //     return res.status(404).send();
    //   }
  
    //   res.send({todo});
    // }).catch((e) => {
    //   res.status(404).send();
    // })
});
  
router.post('/search', authenticate, (req, res)=>{
     var text = req.body.text;
     var todosText =[];
     if(text === " "){
      return res.status(404).send();
    }
    Todo.find({text: new RegExp(text, 'i'), _creator:req.user._id}, (err, todos)=>{
      if(err){
        res.status(404).send();
      }
      if(!todos.length)
        res.status(404).send();

      todos.forEach(todo => {
        let todoSubObj = {};
        todoSubObj.text = todo.text;
        todoSubObj.completed = todo.completed;
        todosText.push(todoSubObj);
      });
      res.send(todosText)
    })
    // Todo.find({"text": new RegExp(text, 'i'), _creator:req.user._id}).then((todos)=>{
    //     if(!todos.length){
    //       return res.status(404).send();
    //     }
        
    //     todos.forEach((todo)=>{
    //       // todosText.push(todo.text);
    //       todoSubObj={}
    //       todoSubObj.text = todo.text;
    //       todoSubObj.completed = todo.completed;
    //       todosText.push(todoSubObj);
    //     })
    //     res.send(todosText);
    // }).catch((e)=>{
    //   res.status(404).send();
    // })
});

module.exports = router;