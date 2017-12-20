var {User} = require('./../models/users');

var authenticate = (req, res, next)=> {

    // var token = req.header('x-auth');
    var token = req.header('Authorization').split(' ')[1];
   // var tArray = token.split(' ');
  //console.log(token);
    User.findByToken(token).then((user)=>{
      if(!user)
        return Promise.reject();
      
     req.user = user;
     req.token = token;
     next();
    }).catch((e)=>{
      res.status(401).send();
    })
}
module.exports={authenticate};
