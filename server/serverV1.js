var { mongoose } = require('./db/mongoose');
var { Todo } = require('../models/todo');
var { User } = require('../models/user');

// newTodo.save().then((doc) => {
//     console.log(`saved the todo Item: ${doc}`);
// }, (err) => {
//     console.log(`unable to save doc ${err}`);
// });
// var newTodo = new Todo({
//     text: '   get up early'
// });

var newTodo2 = new Todo({
    text: '    cook dinner again',
    completed: false,
    completedAt: 0
})

var user = new User({
    name: "Ruthvik AM",
    email: "ruthvikarya@gmail.com"
});

user.save().then((doc) => {
    console.log(`saved the todo Item: ${doc}`);
}, (err) => {
    console.log(`unable to save doc ${err}`);
});