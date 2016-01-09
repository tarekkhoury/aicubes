var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = app.listen(3001);


  var  io = require('socket.io')(server);
  var fs = require('fs');
var serialport = require('serialport');

io.set('log level', 2);

// Serial Port
var portName = '/dev/cu.usbserial-FTH0YKO1'; // Mac環境
var sp = new serialport.SerialPort(portName, {
    baudRate: 9600,
    parser: serialport.parsers.readline("\n"),
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


//click from client
io.sockets.on('connection', function(socket){
    //button pushed
    socket.on('emit_from_client', function(data){
        //check the data
        //console.log(data);

        var receive = JSON.stringify(data);
     //////////////// console.log("Out: " + receive + "");

        //write to serialport
        sp.write(receive + "\n", function(err, results) {
            //console.log('bytes written: ', results);
        });

    });

    //slider changed
    socket.on('emit_from_client_pw', function(data){
        var receive = JSON.stringify(data);
        console.log("slider: [" + receive + "]");
        socket.broadcast.emit('emit_from_server_pw', receive);



    });
});

//data from arduino
sp.on('data', function(data) {
   ///////////////////////// console.log('IN: ' + data);
    try{
        //var length = JSON.parse(data).length;
        //console.log("length = " + length);
        io.sockets.emit('emit_from_server', data);
    }catch(e){
        //eat it;
        //console.log(e);
    }

});


module.exports = app;
