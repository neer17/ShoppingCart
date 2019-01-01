var express = require('express');
var router = express.Router();
var passport = require('passport')

var Product = require('./../models/product')

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

module.exports = router
