const express = require('express')
const router = express.Router()
const stripe = require('stripe')('sk_test_cB3m5aqbUZZdP1FsgtVTQQo0')

const Product = require('./../models/product')
const Cart = require('./../models/cart')
const Order = require('./../models/orders')


//  middleware to render "thank-you-default-layout" as default layout for "thank-you" page
router.all('shop/thank-you', (req, res, next) => {
    req.app.locals.layout = 'thank-you-default-layout'
    next()
})

//  GET /
router.get('/', function (req, res, next) {
    Product.find((err, docs) => {
        if (err) {
            console.log(err)
            return
        }

        res.render('shop/index', {
            title: 'Shopping Cart',
            products: docs
        })
    })
})

//  GET add-to-cart
router.get('/add-to-cart/:id', (req, res) => {
    var id = req.params.id

    var cart = new Cart(req.session.cart ? req.session.cart : {})

    Product.findById(id).then((product) => {
        cart.add(product, product.id)

        //  setting the whole cart in the session
        console.log('storing the cart into the session')
        req.session.cart = cart

        console.log(cart)
        res.render('shop/product-page')
    }).catch((err) => {
        console.log(err)
        res.redirect('/')
    })
})

//  GET shopping-cart
router.get('/shopping-cart', (req, res, next) => {
    res.render('shop/shopping_cart', {
        cart: req.session.cart
    })
})

//  GET checkout
router.get('/checkout', isLoggedIn, (req, res) => {
    if (!req.session.cart) {
        req.flash('empty cart', 'The cart is empty')
        return res.redirect('/')
    }

    res.render('shop/checkout', {
        totalPrice: req.session.cart.totalPrice
    })
})

//  POST thank-you-page
router.post('/thank-you-page', (req, res) => {
    console.log(`inside POST thank-you-page`)

    //  getting the "user" from "PassportJS"
    const user = req.user

    //  getting the cart
    const cart = req.session.cart
    //  clearing the cart
    req.session.cart = null

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

        //  saving the order in the database
        order.save().then((result) => {
            console.log(`cart in thank you page ==> ${JSON.stringify(req.session.cart)}`)
        }).catch((err) => {
            console.log(err)
        })
    })

    res.render('shop/thank-you', {
        title: 'Thank you layout',
        layout: 'thank-you-default-layout'
    })
})


//  GET checkout/clear-cookie
router.get('/checkout/clear-cookie', (req, res) => {
    req.session.cart = null
    console.log(`session.cart ==> ${JSON.stringify(req.session.cart)}`)

   res.render('shop/clear-cookie')
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