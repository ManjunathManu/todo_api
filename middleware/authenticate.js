let {User} = require('./../models/users');

let authenticate = async (req, res, next)=> {
let token = req.header('Authorization').split(' ')[1];
try{
    let user = await User.findByToken(token,(user)=>{
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
    });

}catch(err){
    res.status(401).send();
}
}

module.exports={authenticate};
