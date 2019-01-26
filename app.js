const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const expressHbs = require('express-handlebars')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const passport = require('passport')
const validator = require('express-validator')
const connect_mongo = require('connect-mongo')

//  loading the "index" route
const indexRouter = require('./routes/index')

// //  loading the product seeder
// require('./seeders/product-seeder')
const userRouter = require('./routes/user')

//  getting the Passport Strategy
const config = require('./config/passport-config')

//  setting up the Mongo Store
const MongoStore = connect_mongo(session)

//  creating a new connection to the database
mongoose.connect('mongodb://localhost/shopping', {
    useNewUrlParser: true
})

const app = express()

// view engine setup
app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs'
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', '.hbs')

//  middleware
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
    cookie: {
        maxAge: 180 * 60 * 1000
    },
    store: new MongoStore({mongooseConnection: mongoose.connection})

}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')));


//  checking if the user is logged in
//  storing session and logged in info in global variables
app.use((req, res, next) => {
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