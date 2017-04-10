// var MongoClient = require('mongodb').MongoClient;

//ES6 object destructuring
var user = { name: "Ruthvik", age: 25 };
var { name } = user;
console.log(name);

var { MongoClient, ObjectID } = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable toconnect to the db server');
    }
    console.log('conneted to mongodb server');
    //     var obj = { text: " a new todo list item", completed: false };
    //     db.collection('Todos').insertOne(obj, (err, results) => {
    //         if (err) {
    //             return console.log(`unable to insert ${err}`);
    //         }
    //         console.log(JSON.stringify(results.ops, undefined, 2));
    //     })
    //     db.close();
    // });

    // MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    //     if (err) {
    //         return console.log(`unable to connect to the db ${err}`);
    //     }
    var User = {
        name: "asdf",
        age: 25,
        localtion: "San Fransisco"
    };
    db.collection('Users').insertOne(User, (err, results) => {
        if (err) {
            return console.log(`unable to insert ${err}`);
        }
        console.log(JSON.stringify(results.ops, undefined, 2));
    });
    db.close();
});