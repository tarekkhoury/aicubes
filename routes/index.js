var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

var index_components = [];

var devices_devices = [];
var devices_components = [];


/* GET home page. */
router.get('/', function (req, res, next) {
    var db = new sqlite3.Database('cozy.db');


    // all components
    db.serialize(function () {
        db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "COMPS" ORDER BY mcId', function (err, row) {
            if (err !== null) {
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

    });
    db.close();

});


/* GET home page. */
router.get('/devices', function (req, res, next) {

    var db = new sqlite3.Database('cozy.db');



    db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "DEVICES" ORDER BY value', function (err, row) {
        if (err !== null) {
            next(err);
        }
        else {

            devices_devices = row;
            console.log("devices>>");
            console.log(devices_devices);
            console.log("--");

        }

    });


    db.serialize(function () {

        db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "COMPS" ORDER BY mcId ', function (err, row) {
            if (err !== null) {
                next(err);
            }
            else {

                devices_components = row;
                console.log("components>>");
                console.log(devices_components);
                console.log("--");

            }

        });


    });
    db.close();


    res.render('devices',
        {
            title: 'Devices',
            devices: devices_devices,
            components: devices_components
        });


});


/* GET notifications page. */
router.get('/notifications', function (req, res, next) {
    //var db = new sqlite3.Database('cozy.db');
    //// all components
    //db.serialize(function() {
    //  db.all('SELECT name_s, name_l, type, contact FROM notifications_master', function (err, row) {
    //    if (err !== null) {
    //      next(err);
    //    }
    //    else {
    //      notifications = row;
    //      console.log("notifications>>");
    //      console.log(notifications);
    //      console.log("--");
    //    }
    //  });
    //});
    //db.close();

    res.render('notifications',
        {
            title: 'aiCubes - notifications',
            notifications: [{
                "name_short": "security",
                "name_long": "when doors open and close",
                "type": "mobile",
                "contact": "tarekkhoury78@gmail.com",
            }]

        });
});

/* GET Rules page. */
router.get('/rules', function (req, res, next) {
    //var db = new sqlite3.Database('cozy.db');
    //// all components
    //db.serialize(function() {
    //  db.all('SELECT rule_name, param, comparator, value, action FROM rules_master', function (err, row) {
    //    if (err !== null) {
    //      next(err);
    //    }
    //    else {
    //      rules = row;
    //      console.log("rules>>");
    //      console.log(rules);
    //      console.log("--");
    //    }
    //  });
    //});
    //db.close();

    res.render('rules',
        {
            title: 'aiCubes - rules',
            rules: [{
                "rule_name": "temp > 25",
                "param": "temperature",
                "comparator": ">",
                "value": "25",
                "action": "{\"m\":\"2\",\"c\":\"1\",\"d\":\"Light\",\"a\":\"SET\",\"v\":\"ON\"}"
            }]

        });


});


/* GET Remote page. */
router.get('/remote', function (req, res, next) {
    //var db = new sqlite3.Database('cozy.db');
    //// all components
    //db.serialize(function() {
    //db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "COMPS" ORDER BY mcID', function (err, row) {
    //    if (err !== null) {
    //      next(err);
    //    }
    //    else {
    //      notifications = row;
    //      console.log("remote_devices>>");
    //      console.log(remote_devices);
    //      console.log("--");
    //    }
    //  });
    //});
    //db.close();

    res.render('remote',
        {
            title: 'aiCubes - remote',
            devices: [{
                "rule_name": "temp > 25",
                "param": "temperature",
                "comparator": ">",
                "value": "25",
                "action": "{\"m\":\"2\",\"c\":\"1\",\"d\":\"Light\",\"a\":\"SET\",\"v\":\"ON\"}"
            }]
        });
});


/* GET Remote page. */
router.get('/users', function (req, res, next) {
    //var db = new sqlite3.Database('cozy.db');
    //// all components
    //db.serialize(function() {
    //db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "COMPS" ORDER BY mcID', function (err, row) {
    //    if (err !== null) {
    //      next(err);
    //    }
    //    else {
    //      notifications = row;
    //      console.log("remote_devices>>");
    //      console.log(remote_devices);
    //      console.log("--");
    //    }
    //  });
    //});
    //db.close();

    res.render('users',
        {
            title: 'aiCubes - Users',
            users: [{
                "user_id": "tkhoury",
                "name": "Tarek Khoury",
                "Password": "!@#$%^&*",
                "Role": "Admin",
                "active": "Y"
            }]
        });
});


/* GET Remote page. */
router.get('/dashboards', function (req, res, next) {
    //var db = new sqlite3.Database('cozy.db');
    //// all components
    //db.serialize(function() {
    //db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "COMPS" ORDER BY mcID', function (err, row) {
    //    if (err !== null) {
    //      next(err);
    //    }
    //    else {
    //      notifications = row;
    //      console.log("remote_devices>>");
    //      console.log(remote_devices);
    //      console.log("--");
    //    }
    //  });
    //});
    //db.close();

    res.render('dashboards',
        {
            title: 'aiCubes - Dashboards',
            dashboards: [{
                "user_id": "tkhoury",
                "name": "Tarek Khoury",
                "Password": "!@#$%^&*",
                "Role": "Admin",
                "active": "Y"
            }]
        });
});


/* GET Remote page. */
router.get('/test', function (req, res, next) {
    //var db = new sqlite3.Database('cozy.db');
    //// all components
    //db.serialize(function() {
    //db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "COMPS" ORDER BY mcID', function (err, row) {
    //    if (err !== null) {
    //      next(err);
    //    }
    //    else {
    //      notifications = row;
    //      console.log("remote_devices>>");
    //      console.log(remote_devices);
    //      console.log("--");
    //    }
    //  });
    //});
    //db.close();

    res.render('test',
        {
            title: 'aiCubes - Test',
            //dashboards: [{"user_id":"tkhoury","name":"Tarek Khoury","Password":"!@#$%^&*","Role":"Admin", "active":"Y"}]
        });
});


/* GET Remote page. */
router.get('/help', function (req, res, next) {
    //var db = new sqlite3.Database('cozy.db');
    //// all components
    //db.serialize(function() {
    //db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "COMPS" ORDER BY mcID', function (err, row) {
    //    if (err !== null) {
    //      next(err);
    //    }
    //    else {
    //      notifications = row;
    //      console.log("remote_devices>>");
    //      console.log(remote_devices);
    //      console.log("--");
    //    }
    //  });
    //});
    //db.close();

    res.render('help',
        {
            title: 'aiCubes - Help',
            //dashboards: [{"user_id":"tkhoury","name":"Tarek Khoury","Password":"!@#$%^&*","Role":"Admin", "active":"Y"}]
        });
});


/* GET Remote page. */
router.get('/login', function (req, res, next) {
    //var db = new sqlite3.Database('cozy.db');
    //// all components
    //db.serialize(function() {
    //db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "COMPS" ORDER BY mcID', function (err, row) {
    //    if (err !== null) {
    //      next(err);
    //    }
    //    else {
    //      notifications = row;
    //      console.log("remote_devices>>");
    //      console.log(remote_devices);
    //      console.log("--");
    //    }
    //  });
    //});
    //db.close();

    res.render('login',
        {
            title: 'aiCubes - Login',
            //dashboards: [{"user_id":"tkhoury","name":"Tarek Khoury","Password":"!@#$%^&*","Role":"Admin", "active":"Y"}]
        });
});



///////////////////////////////////////////////////////////////////////////////////
//////////////////////////// Services /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

router.get('/device', function (req, res, next) {
    var db = new sqlite3.Database('cozy.db');

    db.get("SELECT * FROM devices_master", function (err, row) {

        res.json({"count": row.value});

    });
    db.close();
});


router.put('/device/:m/:name', function (req, res, next) {
    var db = new sqlite3.Database('cozy.db');

    db.serialize(function () {

        db.get("UPDATE  devices_master SET name = ? WHERE mcId = ? AND action = 'DEVICES'", req.params.name, req.params.m, function (err, row) {

            if (err) {
                console.log(err);
                res.status(500);
            }
            else {
                res.status(202);
                console.log("success");

            }
            res.end();

        });
    });
    db.close();

});


router.put('/component/:m/:c/:name', function (req, res, next) {
    var db = new sqlite3.Database('cozy.db');

    db.serialize(function () {

        db.get("UPDATE devices_master SET name = ? WHERE mcId = ? AND compId = ? AND action = 'COMPS'", req.params.name, req.params.m, req.params.c, function (err, row) {

            if (err) {
                console.log(err);
                res.status(500);
            }
            else {
                res.status(202);
                console.log("component update success");

            }
            res.end();

        });

    });

    db.close();

});


router.delete('/device/:m', function (req, res, next) {
    var db = new sqlite3.Database('cozy.db');

    db.serialize(function () {

        db.get("DELETE FROM  devices_master WHERE mcId = ? AND action = 'DEVICES'", req.params.m, function (err, row) {

            if (err) {
                console.log(err);
                res.status(500);
            }
            else {
                res.status(202);
                console.log("success");

            }
            res.end();

        });

    });

    db.close();

});


router.delete('/component/:m/:c', function (req, res, next) {
    var db = new sqlite3.Database('cozy.db');

    db.serialize(function () {
        db.get("DELETE FROM  devices_master WHERE mcId = ? AND compId = ? AND action = 'COMPS'", req.params.m, req.params.c, function (err, row) {

            if (err) {
                console.log(err);
                res.status(500);
            }
            else {
                res.status(202);
                console.log("component deleted success");

            }
            res.end();

        });

    });

    db.close();

});


router.delete('/components/:m', function (req, res, next) {
    var db = new sqlite3.Database('cozy.db');

    db.serialize(function () {
        db.get("DELETE FROM  devices_master WHERE mcId = ?  AND action = 'COMPS'", req.params.m, function (err, row) {

            if (err) {
                console.log(err);
                res.status(500);
            }
            else {
                res.status(202);
                console.log("component deleted success");

            }
            res.end();

        });

    });

    db.close();

});



module.exports = router;
