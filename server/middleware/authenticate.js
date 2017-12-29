var {User} = require('./../models/users');

var authenticate = (req, res, next)=> {
    //onsole.log(req.header('Authorization'));
  
    // var token = req.header('x-auth');
    var token = req.header('Authorization').split(' ')[1];
    // console.log(token);
    // User.findByToken(token).then((user)=>{
    //   if(!user){
    //     console.log('no user')
    //     return Promise.reject();
        
    //   }
      
    // console.log(user);
    //  req.user = user;
    //  req.token = token;
    //  next();
    // }).catch((e)=>{
    //   res.status(401).send();
    // })
    // console.log(res)
    // console.log(Object.keys(res));
    //console.log(res.socket.req)
    User.findByToken(token,(user)=>{
        if(user.refreshedToken){
            req.token = user.refreshedToken;
            delete user.refreshedToken;
            req.user = user;  
            //console.log(user);
            next();
        }else{
            req.user = user;
            req.token = token;
            next();
        }
        
    },(error)=>{
        console.log('error',error);
    });
    
}
module.exports={authenticate};
