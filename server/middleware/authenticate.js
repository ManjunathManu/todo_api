var {User} = require('./../models/users');

var authenticate = (req, res, next)=> {
    //onsole.log(req.header('Authorization'));
  
    // var token = req.header('x-auth');
    var token = req.header('Authorization').split(' ')[1];
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
