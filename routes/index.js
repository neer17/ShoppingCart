var express = require('express');
var router = express.Router();
var csrf = require('csurf')
var passport = require('passport')

var Product = require('./../models/product')

//  getting an instance of csrf
// setup route middlewares
var csrfProtection = csrf()


//  middleware
router.use(csrfProtection)

/* GET home page. */
//  gtting the data

router.get('/', function(req, res, next) {
  Product.find((err, docs) => {
    if (err) {
      console.log(err)
      return
    }

    res.render('shop/index', { title: 'Shopping Cart', products: docs })
  })
})

router.get('/users/signup', (req, res, next) => {
  var message = req.flash('error')
  res.render('users/signup', {csrfToken: req.csrfToken(), message: message, hasErrors: message.length > 0})
})

router.post('/users/signup', passport.authenticate('local', {
  successRedirect: '/users/profile',
  failureRedirect: '/users/signup',
  failureFlash: true
}))

router.get('/user/profile', (req, res, next) => {
  res.render('/users/profile')
})

module.exports = router
