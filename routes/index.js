var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

var index_components = [];

var devices_devices = [];
var devices_components = [];
var notifications = [];

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

            //console.log("devices>>");
            //console.log(devices_devices);
            //console.log("--");

        }

    });


    db.serialize(function () {

        db.all('SELECT mcId, compId, desc, action, value, name FROM devices_master WHERE action = "COMPS" ORDER BY mcId ', function (err, row) {
            if (err !== null) {
                next(err);
            }
            else {

                devices_components = row;
                //console.log("components>>");
                //console.log(devices_components);
                //console.log("--");

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
    var db = new sqlite3.Database('cozy.db');
    // all components
    db.serialize(function () {
        db.all('SELECT id, name_short, name_long, type, contact FROM notifications_master', function (err, row) {
            if (err !== null) {
                next(err);
            }
            else {
                notifications = row;
                console.log("notifications>>");
                console.log(notifications);
                console.log("--");

                res.render('notifications',
                    {
                        title: 'aiCubes - notifications',
                        notifications: notifications
                        //    [{
                        //    "name_short": "security",
                        //    "name_long": "when doors open and close",
                        //    "type": "mobile",
                        //    "contact": "tarekkhoury78@gmail.com",
                        //}]

                    });
            }
        });
    });
    db.close();


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


router.post('/api/v1.0/notifications', function (req, res, next) {
    var db = new sqlite3.Database('cozy.db');

    db.serialize(function () {
        try {

            var d = new Date();
            var dt = formatDate(d, "yyyy-MM-dd HH:mm:ss");
            // console.log(dt);
            var obj = {};
            obj = JSON.stringify(req.body)

            //var insert_stmt = db.prepare('INSERT or REPLACE INTO notifications_master VALUES (?,?,?,?,?,?)');
            var insert_stmt = "INSERT or REPLACE INTO notifications_master VALUES ('" + req.body.id + "','" + req.body.name_short + "','" + req.body.name_long + "','" + req.body.type + "','" + req.body.contact + "','" + dt + "')";
            var update_stmt = "UPDATE notifications_master SET id = '" + req.body.id + "', name_short =  '" + req.body.name_short + "', name_long = '" + req.body.name_long + "', type = '" + req.body.type + "', contact = '" + req.body.contact + "' WHERE id = '" + req.body.id + "'";
            var select_stmt = 'SELECT id FROM notifications_master WHERE id = ' + req.body.id;


            db.all(select_stmt, function (err, row) {
                if (err !== null) {
                    next(err);
                }
                else {
                    console.log(row);

                    if (row.length > 0) {
                        console.log('row is NOT empty');


                        /////new code


                        db.serialize(function () {
                            db.run(update_stmt, function (err, row) {
                                if (err) {
                                    console.log(err);
                                    res.status(500);
                                }
                                else {
                                    console.log("notification update success");

                                    res.status(202);

                                }
                                res.end();
                            });

                        });


                        ///// new code

                    }
                    else {
                        console.log('row is empty');
                        console.log('insert notification....');

                        db.serialize(function () {
                            db.run(insert_stmt, function (err, row) {
                                if (err) {
                                    console.log(err);
                                    res.status(500);
                                }
                                else {
                                    console.log("notification insert success");

                                    res.status(202);

                                }
                                //res.end();
                            });

                        });

                        //insert_stmt.run(req.body.id, req.body.name_short, req.body.name_long, req.body.type, req.body.contact, dt);

                    }


                }

            });
           // insert_stmt.finalize();


        } catch
            (e) {
            //eat it;
            console.log(e);

        }
    });
    // db.close();


});


router.delete('/notification/:id', function (req, res, next) {
    var db = new sqlite3.Database('cozy.db');

    db.serialize(function () {
        db.get("DELETE FROM notifications_master WHERE id = ?", req.params.id, function (err, row) {

            if (err) {
                console.log(err);
                res.status(500);
            }
            else {
                res.status(202);
                console.log("notifications deleted success");

            }
            res.end();

        });

    });

    db.close();

});


router.post('/api/v1.0/notifications', function (req, res, next) {
    var db = new sqlite3.Database('cozy.db');

    var obj = {};
    obj = JSON.stringify(req.body)
    console.log('body: ' + obj);

    var stmt = "UPDATE notifications_master SET id = '" + req.body.id + "', name_short =  '" + req.body.name_short + "', name_long = '" + req.body.name_long + "', type = '" + req.body.type + "', contact = '" + req.body.contact + "' WHERE id = '" + req.body.id + "'";
    console.log(stmt);


    ///////////
    db.serialize(function () {

        db.run(stmt, function (err, row) {

            if (err) {
                console.log(err);
                res.status(500);
            }
            else {
                console.log("notification update success");

                res.status(202);

            }
            res.end();
        });

    });
/////////////


    db.close();

});


function formatDate(date, format, utc) {
    var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
    }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};


module.exports = router;



