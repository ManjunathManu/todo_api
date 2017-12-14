const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/users');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [{
    _id:new ObjectID(),
    text:'todo1',
    //_creator:userOneId
},

{_id:new ObjectID(),
    text:'todo2',
    completed:true,
    completedAt:123,
    //_creator:userTwoId
}];

const users = [{
    _id:userOneId,
    email:'abc@example.com',
    password:'useronepass',
    tokens:[{
        access:'auth',
        token:jwt.sign({userOneId, access:'auth'},'abc123').toString()
    }]
}
    ,{
        _id:userTwoId,
        email:'123@example.com',
        password:'usertwopass'
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