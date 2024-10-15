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
var mongoDb = "mongodb+srv://awellbro:awellbro@mdnlibrarycluster.avbgn.mongodb.net/local_library_tut/libraryDataCollection?retryWrites=true&w=majority&appName=mdnLibraryCluster";

main().catch((err) => console.log(err));
async function main(){
  await mongoose.connect(mongoDb)
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// testing views ---------------------


app.get("/", (req, res)=>{
  // res.render seeks out the folder indicated in app.set('views'....)
  // the below code will send the render call to the index file inside the views folder
  res.render("index", {message: "EJS Blows Cock", title: "Dick Blowers Anonymous"});
});
//----------------------------

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
