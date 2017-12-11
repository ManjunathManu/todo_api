// const MongoClient = require('mongodb').MongoClient;
//object destructuring
const {MongoClient, ObjectID} = require('mongodb');
// var obj = new ObjectID();
// console.log(obj);
// console.log('-------------------------');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err)
        return console.log('Unable to connect to the mongoDB');
    console.log('Connected to mongoDB');
   
    db.collection('Todos').find().toArray().then((res)=>{
        console.log('Todos');
        console.log(JSON.stringify(res, undefined, 2));
    },(err)=>{
        console.log('unable  to fetch the data');
    });

    db.collection('Users').find({_id:123}).toArray().then((res)=>{
        console.log(JSON.stringify(res, undefined, 2));
    },(err)=>{
        console.log('Unable to fetch the data of given id',_id);
    });

    db.collection('Users').find({_id:new ObjectID("5a2e11e7a29298141f077ba3")}).toArray().then((res)=>{
            console.log(JSON.stringify(res , undefined, 2));
    },(rej)=>{
        console.log('Unabl to fetch the data');
    })

    db.close();
})