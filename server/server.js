
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

var TodoSchema = new mongoose.Schema({
   text: {type:String,
    required:true,
    minlength:1,
    trim:true
   },
  completed: {type:Boolean,
   default:false
  } ,
  completedAt: {type:Number,
  default:null}
    
});

var Todo = mongoose.model('Todo',TodoSchema);

var todo1 = new Todo({text:'eat'});

var todo2 = new Todo({text:'sleep',completed:false});

var todo3 = new Todo({text:'rave',completed:true});
var todo4 = new Todo({text:'repeat',completed:false,completedAt:123});

var docArray=[todo1, todo2, todo3, todo4];

var saveDocs = (docArray)=>{
    docArray.forEach(element => {
        element.save().then((res)=>{
                        console.log(JSON.stringify(res, undefined, 2));
                    },(err)=>{
                        console.log(err);
                    });
    });
}

saveDocs(docArray);