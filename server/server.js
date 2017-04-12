var config = require('./config/config');
//This is the v2 of the server code... we will add express to do the routing.
var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');
const _ = require('lodash');

var app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });
    //console.log(req.body);
    todo.save().then((doc) => {
        res.status(200).send(doc);
    }, (e) => {
        // console.log(`ERRROR!! ${e}`);
        res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({ todos })
    }, (e) => {
        res.status(400).send({ e });
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send({
            error: 'id not valid'
        });
    }
    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({
            todo
        })
    }, (e) => {
        res.status(400).send({ e });
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        res.status(404).send({
            error: 'id not valid'
        });
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({ todo });
        }
        res.send({
            todo
        })
    }, (e) => {
        return res.status(400).send();
    })
});

//update routes
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        res.status(404).send({
            error: 'id not valid'
        });
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
        if (!todo) {
            return res.status(404).send({ todo });
        }
        res.send({
            todo
        });
        done();
    }).catch((err) => res.status(400).send());
});

//user Routes
app.post('/users', (req, res) => {
    //User ->model methods , we are going to implement
    //User.findByToken -> so that we can query the db based on auth tokens
    //user -> instance (we are gonna generate tokens for individual - user.generateAuthToken)

    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthTokens();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }, (e) => {
        console.log(`ERRROR!! ${e}`);
        res.status(400).send(e);
    });
});



//private routes
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});


app.listen(port, () => {
    console.log(`App started of port ${port}`);
});
module.exports = { app };