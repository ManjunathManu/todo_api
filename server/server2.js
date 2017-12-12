var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID}  =require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/users');

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
     res.status(404).send('Invalid id');
  
  Todo.findById(id).then((todo)=>{
    if(!todo)
      return res.status(404).send('No data found for this id');
    res.send(JSON.stringify(todo, undefined, 2));
  },(err)=>{
     return res.status(404);
  }).catch((e)=>{return res.status(404)});
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});

app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports ={app};