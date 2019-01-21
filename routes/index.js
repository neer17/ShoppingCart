var express = require('express')
var router = express.Router()
var passport = require('passport')
var stripe = require('stripe')('sk_test_cB3m5aqbUZZdP1FsgtVTQQo0')

var Product = require('./../models/product')
var Cart = require('./../models/cart')
var Order = require('./../models/orders')

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

    console.log(req.session.cart)

    console.log(`req session ==> ${JSON.stringify(req.session)}`)
    console.log(`res session ==>  ${JSON.stringify(res.locals.session)}`)


    // var flash = req.flash('empty cart')
    // console.log(flash)

    res.render('shop/index', {
      title: 'Shopping Cart',
      products: docs
    })
  })
})

//  add to cart route
router.get('/add-to-cart/:id', (req, res) => {
  var id = req.params.id

  var cart = new Cart(req.session.cart ? req.session.cart : {})

  Product.findById(id).then((product) => {
    cart.add(product, product.id)

    //  setting the whole cart in the session
    console.log('storing the cart into the session')
    req.session.cart = cart

    res.send('product page')
  }).catch((err) => {
    console.log(err)
    res.redirect('/')
  })
})

//  shopping cart route
router.get('/shopping-cart', (req, res, next) => {
  res.render('shop/shopping_cart', {
    cart: req.session.cart
  })
})

//  checkout route
router.get('/checkout', isLoggedIn, (req, res) => {
  if (!req.session.cart) {
    req.flash('empty cart', 'The cart is empty')
    return res.redirect('/')
  }

  res.render('shop/checkout', {
    totalPrice: req.session.cart.totalPrice
  })
})

//  thank-you-page POST
router.post('/thank-you-page', (req, res) => {

  //  getting the "user" from "PassportJS"
  var user = req.user

  //  getting the cart
  var cart = req.session.cart

  // Token is created using Checkout or Elements!
  // Get the payment token ID submitted by the form:
  const token = req.body.stripeToken

  stripe.charges.create({
    amount: `${cart.totalPrice}00`,
    currency: 'usd',
    description: `${cart.totalQty} books purchased `,
    source: token,
  }).then((result) => {

    //  storing the payment details in the "OrdersSchema"
    var order = new Order({
      user,
      name: user.email,
      cart,
      paymentId: result.id
    })

    order.save().then((result) => {
      //  setting the cart to null
      console.log('before setting cart to null')

      req.session.cart = null
      console.log(req.session.cart)
    }).catch((err) => {
      console.log(err)
    })
  })

  res.render('shop/thank-you', {
    title: 'Thank you layout',
    layout: 'thank-you-default-layout'
  })
})

module.exports = router

//	isLoggedIn
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  req.session.oldUrl = req.url

  console.log(`req url ==> ${req.url}`)
  res.redirect('/users/signin')
}