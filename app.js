var createError = require('http-errors');
var express = require('express');
var path = require('node:path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require("./routes/catalog");
var testRouter = require('./routes/test');

var app = express();


mongoose.set("strictQuery", false);
var mongoDb = "mongodb+srv://awellbro:awellbro@mdnlibrarycluster.avbgn.mongodb.net/local_library_tut?retryWrites=true&w=majority&appName=mdnLibraryCluster";

main().catch((err) => console.log(err));
async function main(){
  await mongoose.connect(mongoDb)
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// middleware below is used to parse form data
app.use(express.json()); // for URL-encoded data
app.use(express.urlencoded({ extended: false })); // for JSON data
//^^^^^
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/catalog", catalogRouter);
app.use('/test', testRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
