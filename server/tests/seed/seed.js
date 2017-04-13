 const { ObjectID } = require('mongodb');
 const { Todo } = require('../../models/todo');
 const { User } = require('../../models/user');
 var jwt = require('jsonwebtoken');

 const user1Id = new ObjectID();
 const user2Id = new ObjectID();
 const user3Id = new ObjectID();
 const usersData = [{
     _id: user1Id,
     email: 'testemail1@gmail.com',
     password: 'testpassword1',
     tokens: [{
         access: 'auth',
         token: jwt.sign({ _id: user1Id, access: 'auth' }, process.env.JWT_SECRET).toString()
     }]
 }, {
     _id: user2Id,
     email: 'testemail2@gmail.com',
     password: 'testpassword2',
     tokens: [{
         access: 'auth',
         token: jwt.sign({ _id: user2Id, access: 'auth' }, process.env.JWT_SECRET).toString()
     }]
 }, {
     _id: user3Id,
     email: 'testemail3@gmail.com',
     password: 'testpassword3',
 }]
 const todoData = [{
         _id: new ObjectID(),
         text: 'first test todo',
         completed: true,
         _creator: user1Id
     },
     {
         _id: new ObjectID(),
         text: 'second test todo',
         _creator: user2Id
     },
     {
         _id: new ObjectID(),
         text: 'third test todo',
         _creator: user3Id,
         completed: true,
         completedAt: 333
     }
 ]

 const populateTodos = (done) => {
     Todo.remove({}).then(() => {
         return Todo.insertMany(todoData);
     }).then(() => done());
 };

 const populateUsers = (done) => {
     User.remove({}).then(() => {
         var user1 = new User(usersData[0]).save();
         var user2 = new User(usersData[1]).save();
         var user3 = new User(usersData[2]).save();
         return Promise.all([user1, user2]);
     }).then(() => {
         done();
     })
 }
 module.exports = { todoData, populateTodos, usersData, populateUsers };