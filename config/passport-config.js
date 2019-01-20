var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var { validationResult } = require('express-validator/check')

var User = require('./../models/user')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user)
    }).catch((err) => {
        if (err)
            done(err)
    })
})

//  signup
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    var errors = validationResult(req)
    var isEmpty = errors.isEmpty()
    var errorArray = errors.array()

    if (!isEmpty) {
        var messages = []
        errorArray.forEach((error) => {
            messages.push(error.msg)
        })
        return done(null, false, req.flash('error', messages))
    }

    User.findOne({ email: email }).then((user) => {
        if (user) {
            return done(null, false, { message: 'Email is already in use' })
        }

        var user = new User();
        user.email = email
        user.password = user.encryptPassword(password)

        return user.save()
    }).then((newUser) => {
        if (newUser)
            return done(null, newUser)
    }).catch((err) => {
        if (err) {
            return done(err)
        }
    })
}))

//  signin
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    var errors = validationResult(req)
    var isEmpty = errors.isEmpty()
    var errorArray = errors.array()

    if (!isEmpty) {
        var messages = []
        errorArray.forEach((error) => {
            messages.push(error.msg)
        })
        return done(null, false, req.flash('error', messages))
    }

    User.findOne({ email: email }).then((user) => {
        if (!user) {
            return done(null, false, { message: 'Email doesn\'t exist' })
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Wrong password'})
        }

        return done(null, user)
    }).catch((err) => {
        return done(err)
    })
}))