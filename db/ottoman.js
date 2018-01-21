// var mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

// mongoose.connect(process.env.MONGODB_URI, {
//     useMongoClient:true,
// });
    
let couchbase = require('couchbase');
let ottoman = require('ottoman');

let cluster = new couchbase.Cluster(process.env.MONGODB_URI);
cluster.authenticate('Administrator','techjini')
ottoman.bucket = cluster.openBucket('todo','');
ottoman.bucket.operationTimeout = 120 * 1000;
module.exports={ottoman};
