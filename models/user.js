var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

var schema = mongoose.Schema


var schema = new schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

schema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5))
}

schema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}


module.exports = mongoose.model('UserSchema', schema)

