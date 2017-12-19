const expect = require('expect');
//const request = require('supertest');
const {ObjectID} =require('mongodb');
const {app} = require('./../server2');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/users');
const {todos, populateTodos, users, populateUsers}  = require('./seed/seed');
const chai = require('chai');
//var expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', ()=>{
  it('should create a new todo',(done)=>{
      var text = 'new todo user 1';
      console.log(users[0].tokens[0].token);
     chai.request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
     // .set('x-auth','token')
      .send({text})
      .then((res)=>{
        // chai.expect(req).to.have.header('x-auth')
        chai.expect(res).to.have.status(200);
        done();
      }).catch((e)=>done(e));
      // .end((err, res)=>{
      //   //expect(err).to.be.null;
      //   // if(err)
      //   //   done(err);
      //     chai.expect(req).to.have.header('x-auth');
      //   // chai.expect(res).to.have.status(401);
      //   done();
      })
  });
// });

describe('POST /users',()=>{
  it ('should create a new user',(done)=>{
    var email = 'sachin@example.com'
    var password = 'sachin'
    chai.request(app)
    .post('/users')
    .send({email,password})
    .then((res)=>{
    chai.expect(res).to.have.status(200);
    chai.expect(res.body.email).to.equal(email);
    chai.expect(res.headers).to.have.property('x-auth');
    chai.expect(res.body).to.have.property('_id');
    done();
    }).catch((e)=> done(e));
  })
})

// describe('POST /todos', () => {
//   it('should create a new todo', (done) => {
//     var text = 'Test todo text';

//     request(app)
//       .post('/todos')
//       .set('x-auth',users[0].tokens[0].token)
//       .send({text})
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.text).toBe(text);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         Todo.find({text}).then((todos) => {
//           expect(todos.length).toBe(1);
//           expect(todos[0].text).toBe(text);
//           done();
//         }).catch((e) => done(e));
//       });
//   });

//   it('should not create todo with invalid body data', (done) => {
//     request(app)
//       .post('/todos')
//       .send({})
//       .expect(400)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         Todo.find().then((todos) => {
//           expect(todos.length).toBe(2);
//           done();
//         }).catch((e) => done(e));
//       });
//   });
// });

// describe('GET /todos',()=>{
//     it('Should return all the  todos',(done)=>{
//         request(app)
//         .get('/todos')
//        .expect(200)
//         .expect((res)=>{
//             expect(res.body.todos.length).toBe(2);
//         })
//         .end(done);
//     });
// });

// describe('GET /todos/:id', () => {
//   it('should return todo doc', (done) => {
//     request(app)
//       .get(`/todos/${todos[0]._id.toHexString()}`)
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todo.text).toBe(todos[0].text);
//       },(err)=>{
//         done();
//       })
//       .end(done);
//   });

//     it('should return 404 for id not found',(done)=>{
//         request(app)
//         .get(`/todos/${new ObjectID().toHexString()}`)
//         .expect(404)
//         .end(done);
//     });

//     it('should return 404 for invalid id',(done)=>{
//         request(app)
//         .get(`/todos/123`)
//         .expect(404)
//         .end(done);
//     });
// });

// describe('DELETE /todos/:id',()=>{
//   it('show  return 200 for successfull delete',(done)=>{
//     var id =todos[1]._id.toHexString() ;
//     request(app)
//     .get(`/todos/${id}`)
//     .expect(200)
//     .expect((res)=>{
//       expect(res.body.todo._id).toBe(id)
//     })
//     .end((err, res) => {
//       if (err) {
//         return done(err);
//       }

//       Todo.findById(id).then((todo)=>{
//         expect(todo).toNotExist;
//           done();
//       },(err)=>{
//           return done(err);
//       }).catch((e)=>done(e));
//   });

// });
// });

// describe('PATCH /todos/:id',()=>{
//   it('should return 200 and update text on successful update',(done)=>{
//       var id = todos[0]._id.toHexString();
//       var text = 'postman update'
//       request(app)
//       .patch(`/todos/${id}`)
//       .send({
//         completed:true,text
//       })
//       .expect(200)
//       .expect((res)=>{
//         expect(res.body.todo.text).toBe(text);
//         expect(res.body.todo.completed).toBe(true);
//         expect(typeof(res.body.todo.completedAt)).toBe('number');
//       })
//       .end(done);
//   });
//   it('should make completedAt null if completed is false',(done)=>{
//     var id = todos[1]._id.toHexString();
//     var text = 'update';
//     request(app)
//     .patch(`/todos/${id}`)
//     .send({text,completed:false})
//     .expect(200)
//     .expect((res)=>{
//       expect(res.body.todo.text).toBe(text);
//       expect(res.body.todo.completed).toBe(false);
//       expect(res.body.todo.completedAt).toBeFalsy();
//     })
//     .end(done);
//   })
// });

// describe('GET /users/me',()=>{
//   it('should return a user on successful authentication', (done)=>{
//     console.log(users[0].tokens[0].token);
//       request(app)
//       .get('/users/me')
//       .set({'x-auth':users[0].tokens[0].token})
//       .expect(200)
//       .expect((res)=>{
//         expect(res.body._id).toBe(users[0]._id.toHexString())
//         expect(res.body.email).toBe(users[0].email)
//       })
//       .end(done);
//   })
//   it('should return 401 for unauthenticate',(done)=>{
//     request(app)
//     .get('/users/me')
//     .expect(401)
//     .expect((res)=>{
//       expect(res.body).toEqual({})
//     })
//     .end(done);
//   })

// });

// describe('POST /users',()=>{
//   it('should create a user',(done)=>{
//     var email = 'manu@example.com';
//     var password = 'qwertyu';
//     request(app)
//     .post('/users')
//     .send({email,password})
//     .expect(200)
//     .expect((res)=>{
//       expect(res.headers['x-auth']).toBeTruthy()
//       expect(res.body.email).toBe(email)
//       expect(res.body._id).toBeTruthy()
//     })
//     .end((err)=>{
//       if(err)
//         return done(err);

//       User.findOne({email}).then((user)=>{
//         expect(user).toBeTruthy()
//         expect(user.email).toBe(email)
//         expect(user.password).not.toBe(password)
//         done();
//       }).catch((err)=>{
//         done(err);
//       })
//     });
//   });

//   it('should return validation error if request invalid',(done)=>{
//     var email = 'manju@example.com'
//     var password = 'manu'
//     request(app)
//     .post('/users')
//     .send({email, password})
//     .expect(400)
//     .end((err)=>{
//       if(err)
//         return done(err);
//       User.findOne({email}).then((user)=>{
//           expect(user).toNotExist();
//       }).catch((e)=>{
//         done(err);
//       })
//     })
//   })

//   it('should return 400 if email already exist',(done)=>{
//     var email=users[0].email;
//     request(app)
//     .post('/users')
//     .send({email, password:'passwoed'})
//     .expect(400)
//     .end((err)=>{
//       if(err)
//         return done(err);
      
//       User.find({email}).then((user)=>{
//           expect(user.length).toBe(1);
//           done();
//       }).catch((err)=> {return done(err)});
//     })
//   })
// });

// describe('POST /users/login',()=>{
//   it('should login user and return auth token',(done)=>{
//     request(app)
//     .post('/users/login')
//     .send({email:users[1].email,
//     password:users[1].password})
//     .expect(200)
//     .expect((res)=>{
//       expect(res.header['x-auth']).toBeTruthy();
//     })
//     .end((err, res)=>{
//       if(err)
//         return done(err);
      
//       User.findById(users[1]._id).then((user)=>{
//         //expect(user.tokens[0]).toMatchObject({access:'auth',token:res.header['x-auth']});
//         expect(user.tokens[0].access).toBe('auth');
//         expect(user.tokens[0].token).toBe(res.header['x-auth']);
//         done();
//       }).catch((e)=> done(e));
//     });
//   })

//   it('should reject invalid login',(done)=>{
//     request(app)
//     .post('/users/login')
//     .send({email:users[1].email, password:users[1].password+1})
//     .expect(401)
//     .expect((res)=>{
//       expect(res.header['x-auth']).toBe(undefined);
//     })
//     .end((err, res)=>{
//       if(err)
//         return done(err);
      
//       User.findById(users[1]._id).then((user)=>{

//         expect(user.tokens.length).toBe(0);
       
//         done();
//       }).catch((e)=> done(e));
//     });
//   })
// });

// describe('DELETE /users/me/token',()=>{
//   it('should delete a token if correct token passed',(done)=>{
//     request(app)
//     .delete('/users/me/token')
//     .set('x-auth',users[0].tokens[0].token)
//     .expect(200)
//     .end((err, res)=>{
//       if(err)
//         return done(err);
      
//       User.findById([users[0]._id]).then((user)=>{
//         expect(user.tokens.length).toBe(0);
//       }).catch((e)=> done(e));
//     });
//   });
// });