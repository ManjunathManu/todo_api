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
    });
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
    Todo.findTodo(id, req.user[0]._id)
    .then((todo)=>{
      res.send(todo);
    })
    .catch((err)=>{
      res.status(404).semd(err.message);
    })
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
    });
});
  
router.delete('/:id',authenticate, (req, res) => {
    var id = req.params.id;
    Todo.findTodo(id, req.user[0]._id)
    .then((todo)=>{
      todo[0].remove((err)=>{
        if(err)
          res.status(404).send();
        res.send(todo[0]);
      })
    })
    .catch((err)=>{
      res.status(404).semd(err.message);
    })
});
  
router.patch('/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    Todo.findTodo(id, req.user[0]._id)
    .then((todo)=>{
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
    })
    .catch((err)=>{
      res.status(404).semd(err.message);
    })
});
  
router.post('/search', authenticate, (req, res)=>{
     var searchText = req.body.text;
     var todosText =[];
     if(searchText === " "){
      return res.status(404).send();
    }
    Todo.find({text: {$contains : searchText}, _creator:req.user[0]._id}, (err, todos)=>{
      if(err){
        return res.status(404).send();
      }
      if(!todos.length)
        return res.status(404).send();

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