const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

//will remove everything from the todo db
// Todo.remove({}).then((res) => {
//     console.log(res);
// });

//we get the doc back
Todo.findOneAndRemove({ _id: '58ed5e4e964bca7ad370be66' }).then((res) => {
    console.log(res);
});

// Todo.findByIdAndRemove('58ed5e49964bca7ad370be65').then((res) => {
//     console.log(res);
// });