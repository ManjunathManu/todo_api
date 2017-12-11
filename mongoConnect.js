const MongoClient = require('mongodb').MongoClient;
//object destructuring
// const {MongoClient, ObjectID} = require('mongodb');
// var obj = new ObjectID();
// console.log(obj);
// console.log('-------------------------');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, db)=>{
    if(err)
        return console.log('Unable to connect to the mongoDB');
    console.log('Connected to mongoDB');
   
    db.collection('Todos').insertOne({text : 'something to do ',
        completed:false},(err, res)=>{
            if(err)
                return console.log('unable to insert',err);
            console.log('Insert sucess:',res.ops);
            console.log('ID=',res.ops[0]._id);
    });

    db.collection('Users').insertMany([{name : 'Manjunath',
        age:22},{_id:123,name:'sachin',age:'24'}],(err, res)=>{
            if(err)
                return console.log('unable to insert',err);
            console.log('Insert sucess:',res.ops);
            console.log('Timestamp:',res.ops[0]._id.getTimestamp());
    });

    db.close();
})