var _ = require('lodash');
require('./config/config.js');

var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID}  =require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/users');
var port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos',(req, res)=>{
  Todo.find().then((todos)=>{
  res.send({todos})
  },(err)=>{
    res.status(400).send(err);
  })
});

app.get('/todos/:id',(req, res)=>{
  var id = req.params.id;
  //res.send(id);
  if(!ObjectID.isValid(id))
     res.status(404).send();
  
  Todo.findById(id).then((todo)=>{
    if(!todo)
      return res.status(404).send();
    res.send({todo});
  },(err)=>{
     return res.status(404);
  }).catch((e)=>{return res.status(404)});
});

app.delete('/todos/:id',(req, res)=>{
    var id= req.params.id;
    if(!ObjectID.isValid(id))
      return res.status(404).send();
    Todo.findByIdAndRemove(new ObjectID(id),  { $set: { text: 'jason bourne' }}).then((todo)=>{
      if(!todo)
        return res.status(404).send();
      res.send({todo});
     
    },(err)=>{
      return res.status(404);
    }).catch((e)=>{return res.status(404)});
});

app.patch('/todos/:id', (req, res)=>{
  
   var id= req.params.id;
   var body = _.pick(req.body, ['text','completed']);

   if(_.isBoolean(body.completed) && body.completed)
   {
     body.completedAt = new Date().getTime();
    
  }else{
    body.completedAt = null;
    body.completed = false;
  }



   if(!ObjectID.isValid(id))
        return res.status(404).send();
    
   Todo.findByIdAndUpdate(id, {$set:body},{new:true}).then((todo)=>{
      if(!todo)
        return res.status(404).send();
      res.send({todo});
   },(err)=>{
      return res.status(404);
   }).catch((e)=> res.status(404));
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports ={app};