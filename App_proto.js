// Load the http module to create an http server.
var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    path = require('path'),
    serialport = require('serialport');

io.set('log level', 1);

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


app.listen(3000);
function handler(req, res){

    var filePath = req.url;

    if (filePath == '/') {
        filePath = '/index.html';

    } else if (filePath == '/test') {
        filePath = '/test.html';

    } else {
        filePath = req.url;
    }


    var extname = path.extname(filePath);

    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    console.log(contentType);

    fs.readFile(__dirname + filePath, function(err, data){
        if(err){
            res.writeHead(500);
            return res.end('Error');
        }
        res.setHeader('Content-Type', contentType);
        res.writeHead(200);
        res.write(data);
        res.end();
    });
}
//click from client
io.sockets.on('connection', function(socket){
    //button pushed
    socket.on('emit_from_client', function(data){
        //check the data
        console.log(data);

        var receive = JSON.stringify(data);
        console.log("data: [" + receive + "]");

        //write to serialport
        sp.write(receive + "\n", function(err, results) {
            console.log('bytes written: ', results);
        });

    });

    //slider changed
    //socket.on('emit_from_client_pw', function(data){
    //    var receive = JSON.stringify(data);
    //    console.log("slider: [" + receive + "]");
    //    socket.broadcast.emit('emit_from_server_pw', receive);



    //});
});



//data from arduino
sp.on('data', function(data) {
    console.log('serialport data received: ' + data);
    try{
        //var length = JSON.parse(data).length;
        //console.log("length = " + length);
        io.sockets.emit('emit_from_server', data);
    }catch(e){
        //eat it;
        //console.log(e);
    }

});



sp.on('close', function(err) {
    console.log('port closed');
});

//serialport open
sp.open(function () {
    console.log('port open');
});
