const express = require('express');
const {ObjectID} = require('mongodb');

let {User} = require('./../models/users');
let {authenticate} = require('./middleware/authenticate');

let router = express.Router();

router.post('/', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
  
    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('Authorization',`Bearer ${token}`).send(user);
    }).catch((e) => {
      res.status(400).send(e.message);
    })
});
  
router.post('/login',(req, res)=>{
    var body = _.pick(req.body, ['email', 'password','keepMeLoggedIn']);
    //res.send(body);
    //console.log(body.keepMeLoggedIn);
    User.findByCredentials(body.email, body.password).then((user)=>{
      return user.generateAuthToken().then((token)=>{
        // res.header('x-auth',token).send(user);
         res.set('Authorization',`Bearer ${token}`).send(user);
      })
    }).catch((err)=>{
      console.log(err);
      return res.status(401).send(err);
    })
});
  
router.get('/me',authenticate, (req, res)=>{
      res.send(req.user);
});
  
router.get('/logout', authenticate, (req, res)=>{
    // req.user.deleteToken(req.token).then(()=>{
    //   res.status(200).send();
    // },()=>{
    //   res.status(401).send();
    // })
      res.send(req.user);
});
  
router.get('/',(req, res)=>{
    User.getUsers().then((users)=>{
      res.status(200).send(users);
    },(err)=>{
      res.status(401).send(err);
    });
});

module.exports = router;