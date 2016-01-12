var express = require('express');
var router = express.Router();

var sqlite3 = require('sqlite3').verbose();



var devices_devices = [];
var devices_components =[]


var index_components =[]




/* GET home page. */
router.get('/', function(req, res, next) {
  var db = new sqlite3.Database('cozy.db');


  // all components
  db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "COMPS" ORDER BY mcID', function(err, row) {
    if(err !== null) {
      next(err);
    }
    else {

      index_components = row;
      console.log("components>>");
      console.log(index_components);
      console.log("--");
    }
  });


  res.render('index',
      {
        title: 'aiCubes',
        components: index_components

      });


db.close();

});


/* GET home page. */
router.get('/devices', function(req, res, next) {

  var db = new sqlite3.Database('cozy.db');


  db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "DEVICES" ORDER BY value', function(err, row) {
    if(err !== null) {
      next(err);
    }
    else {

      devices_devices = row;
      console.log("devices>>");
      console.log(devices_devices);
      console.log("--");

    }

  });




  db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "COMPS" ORDER BY mcId ', function(err, row) {
    if(err !== null) {
      next(err);
    }
    else {

      devices_components = row;
      console.log("components>>");
      console.log(devices_components);
      console.log("--");

    }
  });





  res.render('devices',
      {
        title: 'Devices',
        devices: devices_devices,
        components: devices_components
      });


  db.close();
});





router.get('/device', function(req, res, next) {
  var db = new sqlite3.Database('cozy.db');

  db.get("SELECT * FROM devices_master", function(err, row){

    res.json({ "count" : row.value});

  });
  db.close();

});



router.get('/device/:m/:name', function(req, res, next) {
  var db = new sqlite3.Database('cozy.db');

  db.get("UPDATE  devices_master SET name = ? WHERE mcId = ? AND action = 'DEVICES'",req.params.name, req.params.m , function(err, row){

    if (err){
      console.log(err);
      res.status(500);
    }
    else {
      res.status(202);
      console.log("success");

    }
    res.end();

  });
  db.close();

});


router.get('/component/:m/:c/:name', function(req, res, next) {
  var db = new sqlite3.Database('cozy.db');

  db.get("UPDATE  devices_master SET name = ? WHERE mcId = ? AND compId = ? AND action = 'COMPS'",req.params.name, req.params.m,  req.params.c, function(err, row){

    if (err){
      console.log(err);
      res.status(500);
    }
    else {
      res.status(202);
      console.log("component update success");

    }
    res.end();

  });
  db.close();

});





router.get('/device/:m', function(req, res, next) {
  var db = new sqlite3.Database('cozy.db');

  db.get("DELETE FROM  devices_master WHERE mcId = ? AND action = 'DEVICES'", req.params.m , function(err, row){

    if (err){
      console.log(err);
      res.status(500);
    }
    else {
      res.status(202);
      console.log("success");

    }
    res.end();

  });
  db.close();

});




router.get('/component/:m/:c', function(req, res, next) {
  var db = new sqlite3.Database('cozy.db');

  db.get("DELETE FROM  devices_master WHERE mcId = ? AND compId = ? AND action = 'COMPS'", req.params.m,  req.params.c, function(err, row){

    if (err){
      console.log(err);
      res.status(500);
    }
    else {
      res.status(202);
      console.log("component deleted success");

    }
    res.end();

  });
  db.close();

});


module.exports = router;
