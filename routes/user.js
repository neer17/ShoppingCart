var express = require('express');
var router = express.Router();
var csrf = require('csurf')
var passport = require('passport')
var { body } = require('express-validator/check')

//  getting an instance of csrf
//  setup route middlewares
var csrfProtection = csrf()

//  middleware
router.use(csrfProtection)

router.get('/profile', isLoggedIn,(req, res) => {
	res.render('users/profile')
})

// router.use(isLoggedOut)

//  on Request
router.get('/signup', (req, res) => {
    var messages = req.flash('error')
    res.render('users/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
  })
  
  //  when form is submitted
  router.post('/signup', [
    body('email', 'Invalid email').exists().isEmail(),
    body('password', 'Password should be 6 characters long').exists().isLength({min: 6})
  ], passport.authenticate('local.signup', {
    failureRedirect: '/users/signup',
    failureFlash: true
  }), (req, res, next) => {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl
      req.session.oldUrl = null
      res.redirect(oldUrl)
    } else {
      res.redirect('/users/profile')
    }
  })
  
  //  signin
  router.get('/signin', (req, res) => {
    var messages = req.flash('error')
    res.render('users/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 })
  })
  
  router.post('/signin', [
    body('email', 'Invalid email').exists().isEmail(),
    body('password', 'Password should be 6 characters long').exists()
  ], passport.authenticate('local.signin', {
    failureRedirect: '/users/signin',
    failureFlash: true
	}), (req, res, next) => {
    if (req.session.oldUrl) {
      var oldUrl = req.session.oldUrl
      req.session.oldUrl = null
      res.redirect(oldUrl)
    } else {
      res.redirect('/users/profile')
    }
    
  })
	
	//	for logout
	router.get('/logout', (req, res, next) => {
		req.logout()
		res.redirect('/users/signin')
	})
  
	//	isLoggedIn
	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next()
		}

		res.redirect('/users/signin')
	}

	//  isLoggedOut
	function isLoggedOut (req, res, next){
		if (req.isAuthenticated()) {
			return next()
		}

		res.redirect('/users/signin')
	}

  module.exports = router
  