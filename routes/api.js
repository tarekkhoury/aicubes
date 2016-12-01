var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

var AWS = require('aws-sdk'); 
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
AWS.config.region = 'ap-southeast-2';
var Consumer = require('sqs-consumer');


// var users = [];

// var categories = [];


//--------------------------------------------STREAMS---------------------------------------------

/* GET home page. */
router.get('/v1/streams', function (req, res, next) {

    var access_token = req.query.access_token;
    if (access_token =='1234567890') { // need a better way to store and get the access_token
    res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    // 'Content-Length': ,
    'ETag': '123451221212'
    })

    var limit = req.query.limit;
    var device = req.query.device;
    var component = req.query.component;
    var direction = req.query.direction;
    var select_stmnt = 'SELECT * FROM streams_master ORDER BY cdatetime DESC  LIMIT 20';

    var db = new sqlite3.Database('cozy.db');

    db.serialize(function () {
        db.all(select_stmnt, function (err, rows) {

            if (err !== null) {
                next(err);
            }
            else {
                db.close(); 
                res.json({'data': rows,   'success' : true, 'status': '200'});
            }
        });
    });
    } else {

res.status(403).send({'success' : false, 'status': '403'});
}
});


var map = [];
var devices_map = [];
var i,j =0;
/* GET home page. */
router.get('/v1/devices/components', function (req, res, next) {
i,j =0;

   //devices_map = [];
    var access_token = req.query.access_token;
        if (access_token =='1234567890') { // need a better way to store and get the access_token
            res.set({
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
        // 'Content-Length': ,
        'ETag': '123451221212'
    })
        var select_stmnt = 'SELECT * FROM devices_master ';
        var select_stmnt1 = 'SELECT * FROM devices_master WHERE  action = "DEVICES" ';
        var db = new sqlite3.Database('cozy.db');

        db.serialize(function () {
            db.all(select_stmnt1, function (err, rows1) {
                if (err !== null) {
                    next(err);
                }
                else {
 
            i =0;
            j=0;
            rows1.forEach(function(row1) { 
            
            console.log('SELECT * FROM devices_master  WHERE mcId = ' + parseInt(rows1[j].mcId) + ' AND action = "COMPS" ');
            db.all('SELECT * FROM devices_master  WHERE mcId = ' + parseInt(rows1[j].mcId) + ' AND action = "COMPS" ' , function (err, rows2) {
                if (err !== null) {
                    next(err);
                }
                else {

                console.log("i: " + i);
                 console.log(devices_map[i]);
                devices_map.push(row1);
                devices_map[i].components = rows2;
               
               i++;
                }
            });
            j++        

  })// rows1 for each

                    db.close(); 
                    res.json({'data': {"devices" : devices_map},   'success' : true, 'status': '200'});
                    devices_map = [];
                }
            });
        });
           
        } else {
           res.status(403).send({'success' : false, 'status': '403'});
        }
            

    });





//--------------------------------------------USERS---------------------------------------------


/* GET home page. */
router.get('/v1/users', function (req, res, next) {
    var access_token = req.query.access_token;
    if (access_token =='1234567890') { // need a better way to store and get the access_token

    res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    // 'Content-Length': ,
    'ETag': '123451221212'
    })

    var db = new sqlite3.Database('cozy.db');
        var select_stmnt = 'SELECT * FROM users_master';


    db.serialize(function () {
        //      db.all('SELECT user_id, password ,first_name, last_name, email, cdatetime, FROM users_master', function (err, row) {
        db.all(select_stmnt, function (err, rows) {

            if (err !== null) {
                next(err);

            }
            else {
                db.close(); 
                res.json({'data': rows,   'success' : true, 'status': '200'});
            }
        });
    });
} else {
//res.status(401).redirect('/login');
// res.sendStatus(403);
res.status(403).send({'success' : false, 'status': '403'});
}

});



//--------------------------------------------NOTIFICATIONS---------------------------------------------



/* GET home page. */
router.get('/v1/notifications', function (req, res, next) {
     var access_token = req.query.access_token;
    if (access_token =='1234567890') { // need a better way to store and get the access_token
    res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    // 'Content-Length': ,
    'ETag': '123451221212'
    })

    var db = new sqlite3.Database('cozy.db');
    var select_stmnt = 'SELECT * FROM notifications_master';

    db.serialize(function () {
        //      db.all('SELECT user_id, password ,first_name, last_name, email, cdatetime, FROM users_master', function (err, row) {
        db.all(select_stmnt, function (err, rows) {

            if (err !== null) {
                next(err);
            }
            else {
                db.close(); 
                res.json({'data': rows,   'success' : true, 'status': '200'});
            }
        });
    });
    } else {
//res.status(401).redirect('/login');
// res.sendStatus(403);
res.status(403).send({'success' : false, 'status': '403'});
}
});


//--------------------------------------------RULES---------------------------------------------



/* GET home page. */
router.get('/v1/rules', function (req, res, next) {
     var access_token = req.query.access_token;
    if (access_token =='1234567890') { // need a better way to store and get the access_token
    res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    // 'Content-Length': ,
    'ETag': '123451221212'
    })

    var db = new sqlite3.Database('cozy.db');
    var select_stmnt = 'SELECT * FROM rules_master';

    db.serialize(function () {
        //      db.all('SELECT user_id, password ,first_name, last_name, email, cdatetime, FROM users_master', function (err, row) {
        db.all(select_stmnt, function (err, rows) {

            if (err !== null) {
                next(err);
            }
            else {
                db.close(); 
                res.json({'data': rows,   'success' : true, 'status': '200'});
            }
        });
    });
    } else {
//res.status(401).redirect('/login');
// res.sendStatus(403);
res.status(403).send({'success' : false, 'status': '403'});
}
});



//--------------------------------------------CATEGORIES---------------------------------------------



/* GET home page. */
router.get('/v1/categories', function (req, res, next) {
     var access_token = req.query.access_token;
    if (access_token =='1234567890') { // need a better way to store and get the access_token
    res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    // 'Content-Length': ,
    'ETag': '123451221212'
    })

    var db = new sqlite3.Database('cozy.db');
    var select_stmnt = 'SELECT * FROM categories_master';

    db.serialize(function () {
        //      db.all('SELECT user_id, password ,first_name, last_name, email, cdatetime, FROM users_master', function (err, row) {
        db.all(select_stmnt, function (err, rows) {

            if (err !== null) {
                next(err);
            }
            else {
                db.close(); 
                res.json({'data': rows,   'success' : true, 'status': '200'});
            }
        });
    });
    } else {
//res.status(401).redirect('/login');
// res.sendStatus(403);
res.status(403).send({'success' : false, 'status': '403'});
}
});


//--------------------------------------------DEVICES---------------------------------------------




/* GET home page. */
router.get('/v1/devices', function (req, res, next) {
     var access_token = req.query.access_token;
    if (access_token =='1234567890') { // need a better way to store and get the access_token
    res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    // 'Content-Length': ,
    'ETag': '123451221212'
    })

    var db = new sqlite3.Database('cozy.db');
    var select_stmnt = 'SELECT * FROM devices_master';

    db.serialize(function () {
        //      db.all('SELECT user_id, password ,first_name, last_name, email, cdatetime, FROM users_master', function (err, row) {
        db.all(select_stmnt, function (err, rows) {

            if (err !== null) {
                next(err);
            }
            else {
                db.close(); 
                res.json({'data': rows,   'success' : true, 'status': '200'});
            }
        });
    });
    } else {
//res.status(401).redirect('/login');
// res.sendStatus(403);
res.status(403).send({'success' : false, 'status': '403'});
}
});


var hi = {};
/* GET home page. */
router.post('/v1/:devices/:components', function (req, res, next) {
     var access_token = req.query.access_token;
    if (access_token =='1234567890') { // need a better way to store and get the access_token
    res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    // 'Content-Length': ,
    'ETag': '123451221212'
    })

  var data = {"m":req.params.devices,"c":req.params.components,"d":req.body.description,"a":req.body.action,"v":req.body.value};
     console.log("API Message: " + JSON.stringify(data));

    var queueout = new AWS.SQS({apiVersion: '2012-11-05', params: {QueueUrl: 'https://sqs.ap-southeast-2.amazonaws.com/847733718105/iot-out-queue'}});
     queueout.sendMessage({MessageBody: JSON.stringify(data)}, function (err, data) {
            if (!err) console.log('SQS Message sent.') ;
            if (err) console.log(err) ;
        });


try {
var app2 = Consumer.create({
  queueUrl: 'https://sqs.ap-southeast-2.amazonaws.com/847733718105/iot-in-queue',
  handleMessage: function (message, done) {
    // do some work with `message` 
hi = message.Body;
    console.log(' -- '); 
    console.log('SQS IN message: >> ' + message.Body); 
    console.log(' -- '); 

    // if (hi.m=="1" && hi.c=="3" && a=="PULL") {
    done();
    // }
     console.log('message: m>> ' + JSON.parse(hi).m); 
     console.log('message: c>> ' + JSON.parse(hi).c); 
     console.log('message: a>> ' + JSON.parse(hi).a); 

         // if (JSON.parse(hi).m==req.params.devices && JSON.parse(hi).c==req.params.components && JSON.parse(hi).a=="PULL") {
                 res.json({'data': 'message: ' +  JSON.stringify(data) + ' Sent... returned ' + JSON.stringify(hi) ,   'success' : true, 'status': '200'});
            //}


  }




});
 
app2.on('error', function (message) {
    console.log('message: >> ' + message); 
});
 
app2.start();
} catch(e) {
    console.log(e);
}



    // res.json({'data': 'message:  Sent...',   'success' : true, 'status': '200'});

    } else {
        res.status(403).send({'success' : false, 'status': '403'});
}
});







//--------------------------------------------COMPONENTS---------------------------------------------

/* GET home page. */
router.get('/v1/components', function (req, res, next) {
     var access_token = req.query.access_token;
    if (access_token =='1234567890') { // need a better way to store and get the access_token
    res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    // 'Content-Length': ,
    'ETag': '123451221212'
    })

    var db = new sqlite3.Database('cozy.db');
    var select_stmnt = 'SELECT * FROM devices_master WHERE compId != ""';

    db.serialize(function () {
        //      db.all('SELECT user_id, password ,first_name, last_name, email, cdatetime, FROM users_master', function (err, row) {
        db.all(select_stmnt, function (err, rows) {

            if (err !== null) {
                next(err);
            }
            else {
                db.close(); 
                res.json({'data': rows,   'success' : true, 'status': '200'});
            }
        });
    });
    } else {
//res.status(401).redirect('/login');
// res.sendStatus(403);
res.status(403).send({'success' : false, 'status': '403'});
}
});

module.exports = router;



