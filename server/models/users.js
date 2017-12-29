const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken-refresh');
const _ = require('lodash');
const  bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique:true,
    validate:{
      isAsync:false,
      validator:validator.isEmail,
      message : "{VALUE} is not a valid email id"
    }
  },
  password:{
    type:String,
    required:true,
    minlength:6
  }
  // tokens:[{
  //   access:{
  //     type:String,
  //     requires:true
  //   },
    
  //   token:{
  //    type:String,
  //     required: true
  //   }
  //  }],
   
},{usePushEach : true});


UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET,{expiresIn:'1h'}).toString();
  //user.tokens.push({access, token});
  //user.tokens = user.tokens.concat([{access, token}]);

  return user.save().then(() => {
    return token;
  });
};

// UserSchema.methods.deleteToken = function(token){
//   var user = this;

//   return user.update({$pull:{tokens:{token} } });
// }

UserSchema.statics.findByToken = function (token,success,error){
  var foundUser = null;
  var refreshedToken = null;
  var User = this;
  var decoded;
  try{
        // console.log('trying to decode token----',token)
        // console.log('----');
        decoded = jwt.verify(token, process.env.JWT_SECRET);  
    }
    catch(e){
      if(e.message == "jwt expired"){
        // console.log(e.message)
        var oriDecoded = jwt.verify(token, process.env.JWT_SECRET, {'ignoreExpiration':true});
         refreshedToken = jwt.refresh(oriDecoded, 120, process.env.JWT_SECRET);
        decoded = jwt.verify(refreshedToken, process.env.JWT_SECRET);  
        
        // console.log('refreshedToken',refreshedToken);
        // console.log('-------');
      }else{
        //console.log('can not decode==',e.message);
        return Promise.reject();
      }   
    }
  
    // console.log('decoded id',decoded._id);

  User.findOne({
    '_id':decoded._id,
    // 'tokens.token':token,//enclose in quotes if . is used in query
    // 'tokens.access':'auth'
  },function(err, user){
    if(err){
      error(err);
    }else{
      foundUser = user;
      // console.log('user==',user);
      if(refreshedToken){
      //console.log("ref token is there")
      foundUser.refreshedToken = refreshedToken;
      // console.log('foundUser==',foundUser);
      success(foundUser)
      }else{
        //console.log("ref token is not there");
        success(user);
      }
  
    }
  });
};

UserSchema.pre('save', function (next){
    var user = this;
    if(user.isModified('password'))
    {
      bcrypt.genSalt(10,(err, salt)=>{
        bcrypt.hash(user.password, salt ,(err,hash)=>{
          user.password= hash;
          next();
        })
      })
    }
    else{
      next();
    }

});

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.statics.getUsers = function(){
  var User = this;
  return User.find({}).then((users)=>{
    return users;
  }).catch((e)=>{
    return err;
  })
}

var User = mongoose.model('User', UserSchema);
module.exports = {User}