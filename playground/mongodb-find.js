// var MongoClient = require('mongodb').MongoClient;
var { MongoClient, ObjectID } = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable toconnect to the db server');
    }
    console.log('conneted to mongodb server');
    // db.collection('Todos').findOne({}, (err, res) => {
    //     if (err) {
    //         return console.log(`query findOne Failed ${err}`);
    //     }
    //     console.log(res);
    // });
    //find returns a mongodb cursor. its a pointer to those documents
    //cursor has a ton of methods to access the documents.
    //.toArray() is a cursor method, converts to an array of objects
    //with the properties (whatever we expect)-in this case -> text,id and completed.
    //toArray returns a promise. 
    //so we can tag a then call -> with results for done, and error case. 
    db.collection('Todos').find({ _id: new ObjectID('58ebb1c28b21e2430d26d9f4') }).toArray().then((docs) => {
        console.log(`todos: `);
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('unable to find the documents');
    });

    db.collection('Todos').find().count().then((count) => {
        console.log(`todos: count = ${count}`);
    }, (err) => {
        console.log('unable to find the documents');
    });


    db.collection('Users').find({ name: "John Doe" }).toArray().then((docs) => {
        console.log(`users: `);
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log(`unable to find the documents`);
    });
    db.collection('Users').find({ name: "John Doe" }).count().then((count) => {
        console.log(`users: count ==>  ${count}`);
    }, (err) => {
        console.log(`unable to find the documents`);
    });
    db.close();
});