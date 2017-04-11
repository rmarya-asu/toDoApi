const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/todo');

const todoData = [{
        _id: new ObjectID(),
        text: "first test todo",
        completed: true
    },
    {
        _id: new ObjectID(),
        text: "second test todo"
    },
    {
        _id: new ObjectID(),
        text: "third test todo"
    }
];
//wipes the db with the remove call.
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todoData);
    }).then(() => done());
});
describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = "test todo text";
        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid data in the body', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    done();
                }).catch((e) => { done(e); });
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(3);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return the todo doc', (done) => {
        request(app)
            .get(`/todos/${todoData[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todoData[0].text);
            })
            .end(done);
    });

    it('should return a 404 if todo is not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    })

    it('should return a 400 if object id is invalid', (done) => {
        request(app)
            .get('/todos/100')
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('id not valid');
            })
            .end(done);

    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todoData[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return a 404 if todo is not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    })

    it('should return a 400 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/100')
            .expect(404)
            .expect((res) => {
                expect(res.body.error).toBe('id not valid');
            })
            .end(done);

    });
});