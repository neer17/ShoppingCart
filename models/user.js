var mongoose = require('mongoose')

var schema = mongoose.Schema

var schema = new schema({
    email: {
        type: text,
        required: true
    },
    password: {
        type: text,
        required: true
    }
})


module.exports = mongoose.model('UserSchema', schema)

