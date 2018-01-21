const express = require('express');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

let {User} = require('./../models/users');
let {authenticate} = require('./../middleware/authenticate');

let router = express.Router();

router.post('/', async(req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);
  try {
    user.save((err) => {
      if (err){
        throw err;
        
        return res.status(400).send(err.message);
      }
    });

    let token = await user.generateAuthToken();
    res.header('Authorization', `Bearer ${token}`).send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/login', async(req, res) => {
  var body = _.pick(req.body, ['email', 'password', 'keepMeLoggedIn']);
  try {
    await User.findByCredentials(body.email, body.password,async (user)=>{
      if(!user){
        res.status(401).send();
      }else{
        let token =  await user[0].generateAuthToken();
        res.set('Authorization', `Bearer ${token}`).send(user);
      }
  
    });
   
  } catch (err) {
    res.status(401).send(err);
  }
});

router.get('/me', authenticate, (req, res) => {
  res.send(req.user);
});

router.get('/logout', authenticate, (req, res) => {
  res.send(req.user);
});

router.get('/', async (req, res) => {
  User.getUsers((users)=>{
    console.log(users)
    res.status(200).send(users);
  });
});

module.exports = router;