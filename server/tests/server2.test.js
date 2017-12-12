const expect = require('expect');
const request = require('supertest');
const {ObjectID} =require('mongodb');
const {app} = require('./../server2');
const {Todo} = require('./../models/todo');

const todos = [{_id:new ObjectID(),text:'todo1'},{_id:new ObjectID(),text:'todo2',completed:true,completedAt:123}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
      return Todo.insertMany(todos);
  }).then(()=>done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos',()=>{
    it('Should return all the  todos',(done)=>{
        request(app)
        .get('/todos')
       .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      },(err)=>{
        done();
      })
      .end(done);
  });

    it('should return 404 for id not found',(done)=>{
        request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return 404 for invalid id',(done)=>{
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id',()=>{
  it('show  return 200 for successfull delete',(done)=>{
    var id =todos[1]._id.toHexString() ;
    request(app)
    .get(`/todos/${id}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo._id).toBe(id)
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.findById(id).then((todo)=>{
        expect(todo).toNotExist;
          done();
      },(err)=>{
          return done(err);
      }).catch((e)=>done(e));
  });

});
});

describe('PATCH /todos/:id',()=>{
  it('should return 200 and update text on successful update',(done)=>{
      var id = todos[0]._id.toHexString();
      var text = 'postman update'
      request(app)
      .patch(`/todos/${id}`)
      .send({
        completed:true,text
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof(res.body.todo.completedAt)).toBe('number');
      })
      .end(done);
  });
  it('should make completedAt null if completed is false',(done)=>{
    var id = todos[1]._id.toHexString();
    var text = 'update';
    request(app)
    .patch(`/todos/${id}`)
    .send({text,completed:false})
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeFalsy();
    })
    .end(done);
  })
});