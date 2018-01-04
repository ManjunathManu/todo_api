let {User} = require('./../models/users');

let authenticate = (req, res, next)=> {
let token = req.header('Authorization').split(' ')[1];

User.findByToken(token)
.then((user)=>{
    if(user.refreshedToken){
        req.token = user.refreshedToken;
        delete user.refreshedToken;
        req.user = user;  
        next();
    }else{
        req.user = user;
        req.token = token;
        next();
    }
})
.catch((err)=>{
    res.status(401).send();
    console.log('error', error);
});
}

module.exports={authenticate};
