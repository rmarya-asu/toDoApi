const mongoose = require('mongoose');
const validator = require('validator');
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
var User = mongoose.model('User', {
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

module.exports = { User };