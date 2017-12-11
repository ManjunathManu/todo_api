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
   
//findOneAndUpdate
db.collection('Todos').findOneAndUpdate({_id : new ObjectID('5a2e1678c4797dbb3a283aea')},
                                        {$set:{completed:true}},
                                         {returnOriginal:false}
                                        ).then((res)=>{
                                            console.log(res);
                                        },(err)=>{
                                            console.log(err);
                                        });


    //db.close();
})