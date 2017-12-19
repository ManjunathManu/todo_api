const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/users');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [{
    _id:new ObjectID(),
    text:'todo1',
    _creator:userOneId
},

{_id:new ObjectID(),
    text:'todo2',
    completed:true,
    completedAt:123,
    _creator:userTwoId
}];

const users = [{
    _id:userOneId,
    email:'user1@example.com',
    password:'useronepass',
    tokens:[{
        access:'auth',
        //token:jwt.sign({userOneId, access:'auth'},process.env.JWT_SECRET).toString()
        token:'token'
    }]
}
    ,{
        _id:userTwoId,
        email:'user2@example.com',
        password:'usertwopass',
        tokens:[{
            access:'auth',
            token:jwt.sign({userTwoId, access:'auth'},process.env.JWT_SECRET).toString()
        }]
    }]

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(()=>done());
  };

const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        var user1 = new User(users[0]).save();
        var user2 = new User(users[1]).save();
        return Promise.all([user1, user2]);
    }).then(()=>done());
};

module.exports={todos, populateTodos, users, populateUsers};