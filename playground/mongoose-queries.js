//for id validation, we can use the object id form the mongodb native driver
const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');
var id = "58ed07ade4fcc6692f03da1d";
var userid = "58ec7213c779b559056b7915";
if (!ObjectID.isValid(id)) {
    console.log('ID not valid');
}
Todo.find({
    _id: id
}).then((todos) => {
    console.log('todos', todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    if (!todo) {
        return console.log("id not found");
    }
    console.log(`todos: ${todo}`);
});

Todo.findById(id).then((todo) => {
    //since the findByid returns null -which can be tested by just changing the id,
    //we can just check for 
    if (!todo) {
        return console.log("id not found");
    }
    console.log("todo by id ", todo);
}).catch((e) => console.log(e));

if (!ObjectID.isValid(userid)) {
    console.log('ID not valid');
}
User.findById(userid).then((user) => {
    if (!user) {
        return console.log("id not found");
    }
    console.log("User : ", user);
}).catch((e) => cosole.log(e));