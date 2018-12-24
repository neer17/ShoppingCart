var express = require('express');
var router = express.Router();
var csrf = require('csurf')

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
  res.render('users/signup', {csrfToken: req.csrfToken()})
})

router.post('/users/signup', (req, res, next) => {
  res.redirect('/')
})

module.exports = router
