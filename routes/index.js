var express = require('express');
var router = express.Router();
var passport = require('passport')

var Product = require('./../models/product')
var Cart = require('./../models/cart')

//  middleware to render "thank-you-default-layout" as default layout for "thank-you" page
router.all('shop/thank-you', (req, res, next) => {
  req.app.locals.layout = 'thank-you-default-layout'
  next()
})

/* home page. */
router.get('/', function (req, res, next) {
  Product.find((err, docs) => {
    if (err) {
      console.log(err)
      return
    }

    res.render('shop/index', { title: 'Shopping Cart', products: docs })
  })
})

//  add to cart route
router.get('/add-to-cart/:id', (req, res) => {
  var id = req.params.id

  var cart = new Cart(req.session.cart? req.session.cart: {})

  Product.findById(id).then((product) => {
    cart.add(product, product.id)

    //  setting the whole cart in the session
    req.session.cart = cart

    console.log(req.session.cart)

    res.send('product page')
  }).catch((err) => {
    console.log(err)
    res.redirect('/')
  })
})

//  shopping cart route
router.get('/shopping-cart', (req, res, next) => {
  res.render('shop/shopping_cart', {cart: req.session.cart})
})

//  checkout route
router.get('/checkout', (req, res) => {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart')
  }

  res.render('shop/checkout', {totalPrice: req.session.cart.totalPrice})
})

//  thank-you-page POST
router.post('/thank-you-page', (req, res) => {
  res.render('shop/thank-you')
})

module.exports = router
