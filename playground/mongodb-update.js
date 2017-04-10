// var MongoClient = require('mongodb').MongoClient;
var { MongoClient, ObjectID } = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable toconnect to the db server');
    }
    console.log('conneted to mongodb server');

    //findOneAndUpdate 
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('58ebb1c28b21e2430d26d9f4')
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then((doc) => {
        console.log(doc);
    }, (err) => {
        console.log('error deleting the document');
    });


    //using $inc
    db.collection('Users').findOneAndUpdate({
        name: 'asdf'
    }, {
        $set: {
            name: 'ruthvik',
        },
        $inc: {
            age: 1
        }
    }, {
        returnOriginal: false
    }).then((doc) => {
        console.log(doc);
    }, (err) => {
        console.log('error deleting the document');
    });
    db.close();
});