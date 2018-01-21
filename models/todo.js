// let mongoose = require('mongoose');

// let Todo = mongoose.model('Todo', {
//   text: {
//     type: String,
//     required: true,
//     minlength: 1,
//     trim: true
//   },
//   completed: {
//     type: Boolean,
//     default: false
//   },
//   completedAt: {
//     type: Number,
//     default: null
//   },
//   _creator:{
//     type:mongoose.Schema.Types.ObjectId,
//     required:true
//   }
// });

let ottoman = require('ottoman');
let uuid = require('uuid/v4');

let Todo = ottoman.model('Todo', {
  text: {
    type: "string",
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: "boolean",
    default: false
  },
  completedAt: {
    type: "number",
    default: null
  },
  _creator: {
    type: "string",
    required: true
  }

})

module.exports = {
  Todo
};