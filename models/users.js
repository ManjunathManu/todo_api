
// const mongoose = require('mongoose');
let ottoman = require('./../db/ottoman').ottoman;
// let ottoman = require('ottoman')
const validator = require('validator');
const jwt = require('jsonwebtoken-refresh');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let User = ottoman.model('User', {
  email: {
    type: "string",
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      isAsync: false,
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email id"
    }
  },
  password: {
    type: "string",
    required: true,
    minlength: 6
  }
  },{
    index:{
      findByEmail:{
        by:'email',
        type:'refdoc'
      }
    }
  }
);
 
ottoman.ensureIndices((err)=>{
  if(err){
    throw err;
  }
})
User.toJSON = function () {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

User.prototype.generateAuthToken = async function () {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({
    _id: user._id,
    access
  }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  }).toString();
  return token;
};


User.findByToken = async function (token, callback) {
  // let foundUser = null;
  let refreshedToken = null;
  let User = this;
  let decoded;
  try {
    // console.log('trying to decode token----',token)
    // console.log('----');
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    if (e.message == "jwt expired") {
      // console.log(e.message)
      let oriDecoded = jwt.verify(token, process.env.JWT_SECRET, {
        'ignoreExpiration': true
      });
      refreshedToken = jwt.refresh(oriDecoded, 120, process.env.JWT_SECRET);
      decoded = jwt.verify(refreshedToken, process.env.JWT_SECRET);

      // console.log('refreshedToken',refreshedToken);
      // console.log('-------');
    } else {
      // console.log('can not decode==',e.message);
      return Promise.reject();
    }
  }

  // console.log('decoded id',decoded._id);
  try {
     User.find({
      '_id': decoded._id
    },(err, user)=>{
      if(err)
        throw err;
      if (refreshedToken) {
        user.refreshedToken = refreshedToken;
        // return user;
        callback(user);
      } else {
        // return user;
        callback(user);
      }
    });
   
  } catch (err) {
    throw new Error('Error occured while refreshing the token', err);
  }
};

User.pre("save", async function(user,next){
  // let user = this;
  let hash = await bcrypt.hash(user.password, 10); //auto gen salt and hash
  user.password = hash;
  next();
  // if (user.isModified('password')) {
  //   let hash = await bcrypt.hash(user.password, 10); //auto gen salt and hash
  //   user.password = hash;
  //   next();
  //   // bcrypt.genSalt(10,(err, salt)=>{
  //   //   bcrypt.hash(user.password, salt ,(err,hash)=>{
  //   //     user.password= hash;
  //   //     next();
  //   //   })
  //   // })
  // } else {
  //   next();
  // }

});

User.findByCredentials = async function (email, password, callback) {
  // let User = this;
  User.find({email},async (err, user)=>{
    if(err)
    throw err;
    else {
      if (!user.length) {
        // throw new Error('Invalid email ID,User does not exists');
        callback(false);
      }else{
        let result = await bcrypt.compare(password, user[0].password);
      if (result){
       callback(user);
      }
      else
        callback(false);
      }
      
  }
  });
};

User.getUsers = async function (callback) {
  let User = this;
  try {
    User.find({}, async(err, users) => {
      if (err)
        throw new Error (err);
      else{
        callback(users);      
      }
    });
  } catch (err) {
    return err;
  }
};

module.exports = {
  User
}