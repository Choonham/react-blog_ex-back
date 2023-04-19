const Router = require('koa-router');
const usersCtrl = require('./users.ctrl');
const users = new Router();

users.post('/register', usersCtrl.register);
users.post('/login', usersCtrl.login);
users.post('/check', usersCtrl.check);
users.post('/logout', usersCtrl.logout);

module.exports = users;

