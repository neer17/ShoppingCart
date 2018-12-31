var express = require('express');
var router = express.Router();
var csrf = require('csurf')
var passport = require('passport')
var { check } = require('express-validator/check')

var Product = require('./../models/product')

//  getting an instance of csrf
// setup route middlewares
var csrfProtection = csrf()


//  middleware
router.use(csrfProtection)

/* GET home page. */
//  gtting the data

router.get('/', function (req, res, next) {
  Product.find((err, docs) => {
    if (err) {
      console.log(err)
      return
    }

    res.render('shop/index', { title: 'Shopping Cart', products: docs })
  })
})

//  on Request
router.get('/users/signup', (req, res) => {
  var messages = req.flash('error')
  res.render('users/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
})

//  when form is submitted
router.post('/users/signup', validateEmailAndPassword, passport.authenticate('local', {
  successRedirect: '/users/profile',
  failureRedirect: '/users/signup',
  failureFlash: true
}))

router.get('/users/profile', (req, res) => {
  res.send('success')
})


//  to validate the form in "/users/signup"
function validateEmailAndPassword (req, res, next) {
  check('email').exists().isEmail()
  check('password').exists().isLength({min: 4})
  next()
}

module.exports = router
