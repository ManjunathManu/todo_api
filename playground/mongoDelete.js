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
   
//deleteMany
db.collection('Users').deleteMany({name:'Manjunath'}).then((res)=>{
    console.log(res);
},(err)=>{
    console.log('Error',err);
});
//deleteOne
db.collection('Users').deleteOne({name:'vp'}).then((res)=>{
    console.log(res);
},(err)=>{
    console.log('Error',err);
});
//findOneAndDeleteMany

db.collection('Users').findOneAndDelete({_id:123}).then((res)=>{
    console.log(res);
},(err)=>{
    console.log('Erroe',err)
});

    //db.close();
})