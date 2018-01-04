require('./config/config');

const path = require('path');
const  bcrypt = require('bcryptjs');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
// var {Todo} = require('./models/todo');
// var {User} = require('./models/users');
var {authenticate} = require('./middleware/authenticate');
const publicPath = path.join(__dirname,'./public');
const port = process.env.PORT;


const formidable = require('express-formidable');

var app = express();

//app.use(express.json())
app.use(bodyParser.json())
app.use(require('./controllers'));
// app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(express.static(publicPath));
// app.use(formidable());
// app.use(formidable({
//   encoding: 'utf-8',
//   uploadDir: '/my/dir',
//   multiples: true // req.files to be arrays of files 
// }) );
// app.post('/todos', authenticate, (req, res) => {
//   var todo = new Todo({
//     text: req.body.text,
//     _creator:req.user._id
//   });

//   todo.save().then((doc) => {
//     res.send(doc);
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

// app.get('/todos', authenticate, (req, res) => {
//   Todo.find({_creator:req.user._id}).then((todos) => {
//     res.send({todos});
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

// app.get('/todos/:id',authenticate, (req, res) => {
//   var id = req.params.id;

//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }

//   Todo.findOne({_id:id, _creator:req.user._id}).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(404).send();
//   });
// });

// app.post('/todos/findId', authenticate, (req, res)=>{
//   var text = req.body.text;
//   if(text === " "){
//     return res.status(404).send();
//   }
//   Todo.findOne({text, _creator:req.user._id}).then((todo)=>{
//     if(!todo){
//       return res.status(404).send();
//     }
//     res.send(todo._id);
//   }).catch((e)=>{
//     res.status(404).send();
//   });
// });

// app.delete('/todos/:id',authenticate, (req, res) => {
//   var id = req.params.id;
//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }

//   Todo.findOneAndRemove({_id:id, _creator:req.user._id}).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(404).send();
//   });
// });

// app.patch('/todos/:id', authenticate, (req, res) => {
//   var id = req.params.id;
//   var body = _.pick(req.body, ['text', 'completed']);

//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }

//   if (_.isBoolean(body.completed) && body.completed) {
//     body.completedAt = new Date().getTime();
//   } else {
//     body.completed = false;
//     body.completedAt = null;
//   }

//   Todo.findOneAndUpdate({_id:id, _creator:req.user._id}, {$set: body}, {new: true}).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }

//     res.send({todo});
//   }).catch((e) => {
//     res.status(404).send();
//   })
// });

// app.post('/todos/search', authenticate, (req, res)=>{
//    var text = req.body.text;
//    var todosText =[];
//    if(text === " "){
//     return res.status(404).send();
//   }
//   Todo.find({"text": new RegExp(text, 'i'), _creator:req.user._id}).then((todos)=>{
//       if(!todos.length){
//         return res.status(404).send();
//       }
      
//       todos.forEach((todo)=>{
//         // todosText.push(todo.text);
//         todoSubObj={}
//         todoSubObj.text = todo.text;
//         todoSubObj.completed = todo.completed;
//         todosText.push(todoSubObj);
//       })
//       res.send(todosText);
//   }).catch((e)=>{
//     res.status(404).send();
//   })
// })

// // POST /users
// app.post('/users', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   var user = new User(body);

//   user.save().then(() => {
//     return user.generateAuthToken();
//   }).then((token) => {
//     res.header('Authorization',`Bearer ${token}`).send(user);
//   }).catch((e) => {
//     res.status(400).send(e.message);
//   })
// });

// app.post('/users/login',(req, res)=>{
//   var body = _.pick(req.body, ['email', 'password','keepMeLoggedIn']);
//   //res.send(body);
//   //console.log(body.keepMeLoggedIn);
//   User.findByCredentials(body.email, body.password).then((user)=>{
//     return user.generateAuthToken().then((token)=>{
//       // res.header('x-auth',token).send(user);
//        res.set('Authorization',`Bearer ${token}`).send(user);
//     })
//   }).catch((err)=>{
//     console.log(err);
//     return res.status(401).send(err);
//   })
// });


// app.get('/users/me',authenticate, (req, res)=>{
//     res.send(req.user);
// });

// app.get('/users/logout', authenticate, (req, res)=>{
//   // req.user.deleteToken(req.token).then(()=>{
//   //   res.status(200).send();
//   // },()=>{
//   //   res.status(401).send();
//   // })
//     res.send(req.user);
// });

// app.get('/users',(req, res)=>{
//   User.getUsers().then((users)=>{
//     res.status(200).send(users);
//   },(err)=>{
//     res.status(401).send(err);
//   });
// });

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

// module.exports = {app};