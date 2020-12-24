var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose')
var Team=require('./Model/teamModel')
var https = require('https');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const teamRouter=require('./routes/teamRouter');
const Pusher = require("pusher");
const Cors=require('cors')
const url='mongodb://admin:V7JlPggwbnmfW8C2@cluster0-shard-00-00.feqw6.mongodb.net:27017,cluster0-shard-00-01.feqw6.mongodb.net:27017,cluster0-shard-00-02.feqw6.mongodb.net:27017/coviddb?ssl=true&replicaSet=atlas-ck7qns-shard-0&authSource=admin&retryWrites=true&w=majority';

var app = express();


const pusher = new Pusher({
  appId: "1126297",
  key: "ff47039d4f132db57446",
  secret: "01698c242eeae9b61fb3",
  cluster: "ap2",
  useTLS: true
});

pusher.trigger("my-channel", "my-event", {
  message: "hello world"
});

mongoose.connect(url,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology:true
}).then(()=>{
  console.log("Connected to the Database");
})
.catch(err => {
  console.log(err);
});

const db= mongoose.connection
db.once('open',()=>{
    console.log("DB connected")

    const msgCollection=db.collection("teams");
    const changeStream=msgCollection.watch();
    changeStream.on('change',(change)=>{
      if(change.operationType === 'insert'){
          pusher.trigger('insertTeams','newTeams',{
              'change':change
          });
  
      
      }else if(change.operationType==='update'){
          pusher.trigger('updatedTeams','updateTeams',{
              'change':change
          })

      }else{
            console,log("error triggering pusher")
        }
    });
    

});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(Cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(teamRouter);
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
