const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
// our user model
// {
//     email: "ruthar@gmail.com",
//     password: "jgoinwrfgnwglasfasn",
//     tokens: [{
//         access:'auth',
//         token:"jvqionearungq3nov"
//     }]
// }

//creating a mongoose schema, since we cannot add on methods on top of User model
var UserSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        minlength: 1,
        trim: true,
        unique: true,
        //use mongoose - custom validators to validate email
        validate: {
            // validator: (value) => {
            //     //use npm module validator here to validate the email string
            //     return validator.isEmail(value);
            // },
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }]

});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}
UserSchema.methods.generateAuthToken = function() {
    //not using arrow keyword since it does not have access to the this keyword
    var user = this;
    var access = 'auth';
    var token = jwt.sign({ _id: user._id.toHexString(), access }, process.env.JWT_SECRET);
    user.tokens.push({ access, token });
    return user.save().then(() => {
        return token;
    });
};

UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};


UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        //or
        return Promise.reject('auth failed')
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    }).then((user) => {
        if (!user) {

        }
        return user;
    })
}

UserSchema.statics.findByCredentials = function(email, password, callback) {
    var User = this;
    return User.findOne({ email }).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    resolve(user);
                } else {
                    console.log("HERE2")
                    reject();
                }
            })
        })
    })
}




UserSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});
var User = mongoose.model('User', UserSchema);

module.exports = { User };