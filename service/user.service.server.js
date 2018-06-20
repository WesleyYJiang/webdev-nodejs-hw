module.exports = function (app) {
    app.get('/api/user', findAllUsers);
    app.get('/api/user/:userId', findUserById);
    app.post('/api/user', createUser);
    app.get('/api/profile', profile);
    app.post('/api/logout', logout);
    app.post('/api/login', login);
    app.post('/api/update/user', update);
    app.get('/api/username/:username', findUserByUsername);


    var userModel = require('../models/user/user.model.server');

    function login(req, res) {
        var credentials = req.body;
        userModel
            .findUserByCredentials(credentials)
            .then(function(user) {
                req.session['currentUser'] = user;
                res.json(user);
            })
    }

    function update(req, res) {
        var cond = {username: req.body.username};
        var info = req.body.info;
        userModel
            .updateUser(cond, info)
            .then(res.send(req.session['currentUser']));
    }

    function logout(reg, res) {
        reg.session.destroy();
        res.send(200);
    }

    function findUserById(req, res) {
        var id = req.params['userId'];
        userModel.findUserById(id)
            .then(function (user) {
                res.json(user);
            })
    }

    function findUserByUsername(req, res) {
        var username = req.params['username'];
        userModel.findUserByUsername({username: username})
            .then(function (user) {
                res.send(user);
            })
    }

    function profile(req, res) {
        userModel.findUserById(req.session['currentUser']['_id'])
            .then(function (user) {
                res.json(user);
            });
    }

    function createUser(req, res, ) {
        var user = req.body;
        userModel.createUser(user)
            .then(function (user) {
                req.session['currentUser'] = user;
                res.send(user);
            });
    }

    function findAllUsers(req, res) {
        userModel.findAllUsers().then(function (users) {res.send(users);})
    }
};
