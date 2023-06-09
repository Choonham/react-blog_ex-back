const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const api = require('./api');
const jwtMiddleware = require('./lib/jwtMiddleware');
const cors = require('cors');

const app = new Koa();
const router = new Router();

router.use('/api', api.routes());

require("../models");

// 라우터 적용 적엔 bodyParser 적용
app.use(bodyParser());
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000, () => {
    console.log('Listening to port 4000');
});