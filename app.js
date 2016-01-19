var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var RuleEngine = require("node-rules");


//var jsonFile = require('jsonfile');
//var util = require('util')

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('cozy.db');


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = app.listen(3001);


var io = require('socket.io')(server);
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
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// Database initialization
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='streams_master'",
    function (err, rows) {
        if (err !== null) {
            console.log(err);
        }
        else if (rows === undefined) {
            db.run('CREATE TABLE streams_master (mcId TEXT, compId TEXT, desc TEXT, action TEXT,value TEXT, name TEXT, cdatetime DATETIME)', function (err) {
                if (err !== null) {
                    console.log(err);
                }
                else {
                    console.log("SQL Table 'streams_master' initialized.");
                }
            });
        }
        else
            console.log("SQL Table 'streams_master' already initialized.");
    });


// Database initialization
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='devices_master'",
    function (err, rows) {
        if (err !== null) {
            console.log(err);
        }
        else if (rows === undefined) {
            db.run('CREATE TABLE devices_master (mcId TEXT, compId TEXT, desc TEXT, action TEXT,value TEXT, name TEXT, visible TEXT, category TEXT, cdatetime DATETIME)', function (err) {
                if (err !== null) {
                    console.log(err);
                }
                else {
                    console.log("SQL Table 'devices_master' initialized.");
                }
            });
        }
        else
            console.log("SQL Table 'devices_master' already initialized.");
    });


// Database initialization
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='notifications_master'",
    function (err, rows) {
        if (err !== null) {
            console.log(err);
        }
        else if (rows === undefined) {
            //   db.run('CREATE TABLE notifications_master (id integer primary key autoincrement, name_short TEXT, name_long TEXT, type TEXT,contact TEXT, cdatetime DATETIME)', function (err) {
            db.run('CREATE TABLE notifications_master (id TEST, name_short TEXT, name_long TEXT, type TEXT,contact TEXT, cdatetime DATETIME)', function (err) {

                if (err !== null) {
                    console.log(err);
                }
                else {
                    console.log("SQL Table 'notifications_master' initialized.");
                }
            });
        }
        else
            console.log("SQL Table 'notifications_master' already initialized.");
    });


// Database initialization
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users_master'",
    function (err, rows) {
        if (err !== null) {
            console.log(err);
        }
        else if (rows === undefined) {
            db.run('CREATE TABLE users_master (user_id TEXT PRIMARY KEY, password TEXT, first_name TEXT, last_name TEXT,email TEXT, cdatetime DATETIME)', function (err) {
                if (err !== null) {
                    console.log(err);
                }
                else {
                    console.log("SQL Table 'users_master' initialized.");
                }
            });
        }
        else
            console.log("SQL Table 'users_master' already initialized.");
    });


// Database initialization// add lowervalue and upper value........ for between comparison....
db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='rules_master'",
    function (err, rows) {
        if (err !== null) {
            console.log(err);
        }
        else if (rows === undefined) {
            db.run('CREATE TABLE rules_master (rule_id TEXT, ' +
                'rule_name TEXT, ' +
                'condition_mcid TEXT, ' +
                'condition_compid TEXT, ' +
                'condition_expression TEXT,' +
                'condition_value TEXT, ' +
                'condition_value_lower TEXT, ' +
                'condition_value_higher TEXT, ' +
                'consequence_mcid TEXT, ' +
                'consequence_compid TEXT, ' +
                'consequence_action TEXT, ' +
                'consequence_value TEXT, ' +
                'active TEXT, ' +
                'cdatetime DATETIME)', function (err) {
                if (err !== null) {
                    console.log(err);
                }
                else {
                    console.log("SQL Table 'rules_master' initialized.");
                }
            });
        }
        else
            console.log("SQL Table 'rules_master' already initialized.");
    });


//click from client
io.sockets.on('connection', function (socket) {
    //button pushed
    socket.on('emit_from_client', function (data) {
        //check the data
        //console.log(data);

        var receive = JSON.stringify(data);
        console.log("Out: " + receive + "");

        //write to serialport
        sp.write(receive + "\n", function (err, results) {
            //console.log('bytes written: ', results);
        });

    });


});

//data from arduino
sp.on('data', function (data) {
        console.log('IN: ' + data);
        try {
            if (JSON.parse(data).d === "Temperature (C)") {
                evaluateRules(data);
            }
        } catch (e) {
            //eat it;
            console.log(e);
        }

        try {


            //var devicesFile = 'config/devices.json';
            var d = new Date();
            var dt = formatDate(d, "yyyy-MM-dd HH:mm:ss");
            // console.log(dt);

            var stmt_devices = db.prepare('INSERT or REPLACE INTO devices_master VALUES (?,?,?,?,?,?,?,?,?)');
            var stmt_streams = db.prepare('INSERT or REPLACE INTO streams_master VALUES (?,?,?,?,?,?,?)');


            if (JSON.parse(data).a == "DEVICES") {
                db.all('SELECT value FROM devices_master WHERE action = "DEVICES" AND value = ' + JSON.parse(data).v, function (err, row) {
                    if (err !== null) {
                        next(err);
                    }
                    else {
                        //console.log(row);

                        if (row.length <= 0) {
                            //console.log('row is empty');
                            //console.log('insert device....');

                            stmt_devices.run(JSON.parse(data).m, JSON.parse(data).c, JSON.parse(data).d, JSON.parse(data).a, JSON.parse(data).v, JSON.parse(data).d, dt);
                        }
                        else {
                            //console.log('row is NOT empty');
                        }

                    }
                });


                io.sockets.emit('emit_from_server_devices', data);

            } else if (JSON.parse(data).a == "COMPS") {

                db.all('SELECT compId FROM devices_master WHERE action = "COMPS" AND mcId = ' + JSON.parse(data).m + ' AND compId = ' + JSON.parse(data).c, function (err, row) {
                    if (err !== null) {
                        next(err);
                    }
                    else {
                        //console.log(row);

                        if (row.length <= 0) {
                            //console.log('row is empty');
                            //console.log('insert component....');
                            stmt_devices.run(JSON.parse(data).m, JSON.parse(data).c, JSON.parse(data).d, JSON.parse(data).a, JSON.parse(data).v, JSON.parse(data).d, 'y', JSON.parse(data).v, dt);
                        }
                        else {
                            //console.log('row is NOT empty');
                        }

                    }
                });

                io.sockets.emit('emit_from_server_devices', data);


            } else {


                stmt_streams.run(JSON.parse(data).m, JSON.parse(data).c, JSON.parse(data).d, JSON.parse(data).a, JSON.parse(data).v, JSON.parse(data).d, dt);

                io.sockets.emit('emit_from_server', data);
            }


        }
        catch
            (e) {
            //eat it;
            console.log(e);
        }

    }
);


//'CREATE TABLE rules_master (rule_id TEXT, ' +
//    'rule_name TEXT, ' +
//    'condition_mcid TEXT, ' +
//    'condition_compid TEXT, ' +
//    'condition_expression TEXT,' +
//    'condition_value TEXT, ' +
//    'condition_value_lower TEXT, ' +
//    'condition_value_higher TEXT, ' +
//    'consequence_mcid TEXT, ' +
//    'consequence_compid TEXT, ' +
//    'consequence_action TEXT, ' +
//    'consequence_value TEXT, ' +
//    'active TEXT, ' +
//    'cdatetime DATETIME)'

function evaluateRules(fact) {
    var result = 1;
    var action = {};
    var counter = 0;


    db.all('SELECT DISTINCT rule_id FROM rules_master WHERE condition_mcid = "' + JSON.parse(fact).m + '" AND condition_compid = "' + JSON.parse(fact).c + '"', function (err, distinct_rules_rows) {
        if (err !== null) {
            console.log(err);

            next(err);
        }
        else {
            //console.log(row);
            if (distinct_rules_rows.length > 0) {
                distinct_rules_rows.forEach(function (distinct_rules_row) {
                    //console.log(distinct_rules_row.rule_id);

                    ////////////////////////////////////////////////////////////


                    db.all('SELECT DISTINCT * FROM rules_master WHERE rule_id = "' + distinct_rules_row.rule_id + '"', function (err, specific_distinct_rules_rows) {
                        if (err !== null) {
                            console.log(err);
                            next(err);
                        }
                        else {
                            //console.log(row);
                            if (specific_distinct_rules_rows.length > 0) {
                                specific_distinct_rules_rows.forEach(function (specific_distinct_rules_row) {


                                    //console.log(specific_distinct_rules_row.rule_id);
                                    if (specific_distinct_rules_rows.length === 1) {
                                        //console.log("--> Simple Rule");
                                        var expression = '';
                                        if (specific_distinct_rules_row.condition_expression !== 'between') { // not between
                                            expression = JSON.parse(fact).v + ' ' + specific_distinct_rules_row.condition_expression + ' ' + specific_distinct_rules_row.condition_value;
                                        } else {
                                            expression = specific_distinct_rules_row.condition_value_lower + ' <= ' + JSON.parse(fact).v + ' <= ' + specific_distinct_rules_row.condition_value_higher;
                                        }


                                        if (eval(expression)) {
                                            console.log('~~~~expression: ' + expression + ' - eval: ' + eval(expression));

                                            console.log('Rule triggered::', specific_distinct_rules_row.rule_id);
                                            //result = true;
                                            action = {
                                                "m": specific_distinct_rules_row.consequence_mcid,
                                                "c": specific_distinct_rules_row.consequence_compid,
                                                "d": "",
                                                "a": specific_distinct_rules_row.consequence_action,
                                                "v": specific_distinct_rules_row.consequence_value
                                            };
                                            sp.write(JSON.stringify(action) + "\n", function (err, results) {
                                                console.log('OUT:', JSON.stringify(action));

                                                //console.log('bytes written: ', results);
                                            });
                                        }


                                    } else {

                                        console.log("--> Composite Rule");
                                        //console.log("--> Simple Rule");
                                        var expression = '';

                                        if (counter === 0) {
                                            console.log('first loop');

                                            if (specific_distinct_rules_row.condition_expression !== 'between') { // not between
                                                expression = JSON.parse(fact).v + ' ' + specific_distinct_rules_row.condition_expression + ' ' + specific_distinct_rules_row.condition_value;
                                            } else {
                                                expression = specific_distinct_rules_row.condition_value_lower + ' <= ' + JSON.parse(fact).v + ' <= ' + specific_distinct_rules_row.condition_value_higher;
                                            }
                                            if (eval(expression)) {
                                                result++;
                                                console.log('1~~~~expression: ' + expression + ' - eval: ' + eval(expression));
                                                console.log('1~~~~result: ' + result + ' - result++ ');
                                            } else {
                                                result--;
                                                console.log('1~~~~expression: ' + expression + ' - eval: ' + eval(expression));
                                                console.log('1~~~~result: ' + result + ' - result-- ');
                                            }
                                            counter++;
                                        } else {

                                            ///////////////////////////////////////////////////////////////////////
                                            console.log('beyong first loop');


                                            db.all('SELECT * FROM streams_master WHERE mcId = "' + specific_distinct_rules_row.condition_mcid + '" AND compId = "' + specific_distinct_rules_row.condition_compid + '" ORDER BY cdatetime DESC LIMIT 1', function (err, streams_rows) {
                                                if (err !== null) {
                                                    next(err);
                                                }
                                                else {

                                                    streams_rows.forEach(function (streams_row) {

                                                        if (streams_row.condition_expression !== 'between') { // not between
                                                            expression = streams_row.value + ' ' + specific_distinct_rules_row.condition_expression + ' ' + specific_distinct_rules_row.condition_value;
                                                        } else {
                                                            expression = specific_distinct_rules_row.condition_value_lower + ' <= ' + streams_row.value + ' <= ' + specific_distinct_rules_row.condition_value_higher;
                                                        }
                                                        if (eval(expression)) {
                                                            result++;
                                                            console.log('2~~~~expression: ' + expression + ' - eval: ' + eval(expression));
                                                            console.log('2~~~~result: ' + result + ' - result++ ');
                                                        } else {
                                                            result--;
                                                            console.log('2~~~~expression: ' + expression + ' - eval: ' + eval(expression));
                                                            console.log('2~~~~result: ' + result + ' - result-- ');
                                                        }
                                                        counter++;
                                                    });

                                                }
                                            });

                                            ///////////////////////////////////////////////////////////////////

                                        }


                                    }


                                    console.log("******specific_distinct_rules_rows.length:" + specific_distinct_rules_rows.length + "  result: " + result);

                                    if (result == specific_distinct_rules_rows.length) {
                                        console.log("******IN******");
                                        console.log('Rule triggered::', specific_distinct_rules_row.rule_id);
                                        action = {
                                            "m": specific_distinct_rules_row.consequence_mcid,
                                            "c": specific_distinct_rules_row.consequence_compid,
                                            "d": "",
                                            "a": specific_distinct_rules_row.consequence_action,
                                            "v": specific_distinct_rules_row.consequence_value
                                        };
                                        sp.write(JSON.stringify(action) + "\n", function (err, results) {
                                            console.log('OUT:', JSON.stringify(action));

                                            //console.log('bytes written: ', results);
                                        });

                                    }
                                });

                                //console.log('row is empty');

                            } else {
                                //console.log('row is NOT empty');
                            }

                        }
                    });


                    ///////////////////////////////////////////////////////////////

                })


                //console.log('row is empty');

            }
            else {
                //console.log('row is NOT empty');
            }

        }
    });


    //var result = {value:false, reason:"condition unmet"};
// result = false;

//  Select distinct rule name from rules_master where mcid = # and compid  # { // returnes multiple rule
//         for each distinct rule name {

//              select rules where rule name == above {
    //                if rule.length == 1 (i.e. single/simple rule) {take action} else {

//                    for each rule {
//                          if mc and comp == the inputs (Construct expression string i.e ("fact.value >= 28")) {
//                          eval(the above expression)
//                          if (expression is true) {
//                              set result = true;
//                          } else {
//                              set result = false
//                          };
    //} else
    //select condition from db for other devices where timeframe is within limits
    //
    //{
    //construct and eval
//                          if (expression is true) {
//                              set result = true;
//                          } else {
//                              set result = false
//                          };
// }

//                    }
    //    if (results == true) {
//                      construct action for this rule get (m: "1",c:"1",d:"", a:"SET", v:"ON" ) // from the triggered rule not the selected ones
//                        send twice to make sure
    //  }

//                      }
//          }
//     }


    //var sendData1 = {m: "2", c: "2", d: "Light", a: "SET", v: "ON"};
    //var sendData2 = {m: "2", c: "2", d: "Light", a: "SET", v: "OFF"};
    //
    //
    //console.log('Rules: Facts >>' + fact);
    //
    //
    //var rules = [{
    //    "condition": function (R) {
    //        R.when(JSON.parse(this).d === "1" && JSON.parse(this).d === "3" && parseFloat(JSON.parse(this).v) > 10.00);
    //    },
    //    "consequence": function (R) {
    //        //this.isMobile = true;
    //        console.log("--------rule condition detected: temperature");
    //        // result.value = true;
    //        this.result = true;
    //        this.reason = "The transaction was blocked as debit cards are not allowed";
    //        console.log("--------rule consequence fired: temperature> " + JSON.parse(this).v);
    //        console.log("this.result:" + this.result);
    //        R.stop();//we just set a value on to fact, now lests process rest of rules
    //    }
    //}
    //    //    , {
    //    //    "condition": function(R) {
    //    //        R.when(parseFloat(JSON.parse(this).v) > 10.00);
    //    //    },
    //    //    "consequence": function(R) {
    //    //        //result.value = true;
    //    //        this.result = true;
    //    //       this.reason = "The transaction was blocked as debit cards are not allowed";
    //    //        console.log("--------rule consequence fired: temperature> " + JSON.parse(this).v);
    //    //
    //    //        R.stop();
    //    //    }
    //    //}
    //
    //];
    //
    //var R = new RuleEngine();
    //R.register(rules);
    ///* Fact with more than 500 as transaction but a Debit card, and this should be blocked */
    ////var fact = {
    ////    "name": "user4",
    ////    "application": "MOB",
    ////    "transactionTotal": 600,
    ////    "cardType": "Credit"
    ////};
    //
    //R.execute(fact, function (data) {
    //    //
    //    console.log("---->data: " + data);
    //    console.log("2) this.result:" + JSON.stringify(this.result));
    //    if (this.result) {
    //        console.log("---->Rule Executed successfully do something (Light on) : " + JSON.stringify(sendData1));
    //
    //        sp.write('{"m":"2","c":"1","d":"","a":"SET","v":"ON"}' + "\n", function (err, results) {
    //            console.log('bytes written: ', results);
    //        });
    //
    //    } else {
    //        console.log("-----><Rule Executed un-successfully do opposite something (Light Off): " + JSON.stringify(sendData2));
    //        sp.write('{"m":"2","c":"1","d":"","a":"SET","v":"OFF"}' + "\n", function (err, results) {
    //            console.log('bytes written: ', results);
    //        });
    //    }
    //    //
    //    //if(data.isMobile) {
    //    //    console.log("It was from a mobile device too!!");
    //    //}

    //});

}


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


module.exports = app;
