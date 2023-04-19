const Router = require('koa-router');
const api = new Router();

const posts = require('./posts');
const users = require('./users');

api.use('/posts', posts.routes());
api.use('/users', users.routes());

api.get('/test', ctx => {
    ctx.body = 'test 성공';
});

// 라우터를 내보낸다.
module.exports = api;