const Router = require('koa-router');
const postsCtrl = require('./posts.ctrl');
const checkLoggedIn = require("../../lib/checkLoggedIn");
const posts = new Router();

posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);
posts.get('/:id', postsCtrl.read);
posts.delete('/:id', checkLoggedIn, postsCtrl.remove);
posts.patch('/:id', checkLoggedIn, postsCtrl.update);

module.exports = posts