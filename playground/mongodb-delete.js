// var MongoClient = require('mongodb').MongoClient;
var { MongoClient, ObjectID } = require('mongodb');

var obj = new ObjectID();
console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('unable toconnect to the db server');
    }
    console.log('conneted to mongodb server');

    //deleteMany
    // db.collection('Todos').deleteMany({ text: ' create mongodb find method' }).then((doc) => {
    //     console.log(doc);
    // }, (err) => {
    //     console.log('error deleting the document');
    // });
    //deleteOne
    // db.collection('Todos').deleteOne({ text: 'Eat lunch' }).then((doc) => {
    //     console.log(doc);
    // }, (err) => {
    //     console.log('error deleting the document');
    // });
    //findOneAndDelete
    // db.collection('Todos').findOneAndDelete({ text: 'Eat lunch' }).then((doc) => {
    //     console.log(doc);
    // }, (err) => {
    //     console.log('error deleting the document');
    // });

    //deleteMany
    db.collection('Users').deleteMany({ name: 'John Doe' }).then((doc) => {
        console.log(doc);
    }, (err) => {
        console.log('error deleting the document');
    });
    db.close();
});