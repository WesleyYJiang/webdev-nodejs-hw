const localURL = 'mongodb://localhost/webdev-hw';
const remoteURL = 'mongodb://heroku_3qkqphch:6apr8qnv9tr0pbthftnj6oqn5t@ds263520.mlab.com:63520/heroku_3qkqphch';


var express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(remoteURL);


var app = express();
const idleTimeoutSeconds = 1800;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://webdev-angular-hw.herokuapp.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

var session = require('express-session');
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'any string',
    cookie: {
        maxAge: idleTimeoutSeconds * 1000,
    },
    rolling: true
}));


app.get('/', function (req, res) {
    res.send('Hello World')
});

app.get('/message/:theMessage', function (req, res) {
    var theMessage = req.params['theMessage'];
    res.send(theMessage);
});

app.get('/api/session/set/:name/:value',
    setSession);
app.get('/api/session/get/:name',
    getSession);
// app.get('/api/session/get',
//   getSessionAll);
// app.get('/api/session/reset',
//   resetSession);

function setSession(req, res) {
    var name = req.params['name'];
    var value = req.params['value'];
    req.session[name] = value;
    res.send(req.session);
}

function getSession(req, res) {
    var name = req.params['name'];
    var value = req.session[name];
    res.send(value);
}

var userService = require('./service/user.service.server');
userService(app);


var port = process.env.PORT || 4000;
console.log("================== PORT =================");
console.log(port);
console.log(process.env.PORT);

require('./service/section.service.server')(app);
app.listen(port);
