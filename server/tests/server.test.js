const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');
const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todoData, populateTodos, usersData, populateUsers } = require('./seed/seed');

//wipes the db with the remove call.
beforeEach(populateUsers);
beforeEach(populateTodos);
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


describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        var text = "test update todo";
        var hexId = todoData[2]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var text = "test update todo !!!";
        var hexId = todoData[1]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });

});

describe('Get /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', usersData[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(usersData[0]._id.toHexString());
                expect(res.body.email).toBe(usersData[0].email);
            })
            .end(done);
    });
    it('should return a 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', '1234')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a new user', (done) => {
        var email = "example@example.com";
        var password = "1234asdf";
        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            }).end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({ email }).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                })
            });
    })
    it('should return validation errors if request is invalid', (done) => {
        request(app)
            .post('/users')
            .send({ email: "asdf", password: "1234" })
            .expect(400)
            .end(done);
    });
    it('should not create user if email is in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: usersData[0].email,
                password: usersData[0].password
            })
            .expect(400)
            .end(done);
    });
});