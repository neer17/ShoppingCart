var createError = require('http-errors')
var express = require('express')
var session = require('express-session')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var expressHbs = require('express-handlebars')
var mongoose = require('mongoose')
var flash = require('connect-flash')
var passport = require('passport')
var validator = require('express-validator')
var MongooseStore = require('connect-mongo')(session)

mongoose.connect('mongodb://localhost/shopping', {
  useNewUrlParser: true
})

// //  loading the product seeder
// require('./seeders/product-seeder')

//  loading the "index" route
var indexRouter = require('./routes/index')
var userRouter = require('./routes/user')

//  getting the Passport Strategy  
require('./config/passport-config')

var app = express()

// view engine setup
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}))
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(validator())
app.use(cookieParser())
app.use(session({
  secret: 'mysuperseccret',
  resave: false,
  saveUninitialized: false,
  store: new MongooseStore({
    'mongooseConnection': mongoose.connection
  }),
  cookie: {
    maxAge: 180 * 60 * 1000
  }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));


//  checking if the user is logged in
//  storing session and logged in info in global variables
app.use((req, res, next) => {
  console.log('inside the middleware')
  
  res.locals.isLoggedIn = req.isAuthenticated()
  res.locals.session = req.session
  next()
})

app.use('/users', userRouter)
app.use('/', indexRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;