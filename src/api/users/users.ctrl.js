const db = require("../../../models");
const bcrypt = require("bcrypt");
const jwtGenerator = require('../../lib/jwtGenerator');
const sanitizeHtml = require("sanitize-html");
const User = db.user;

const env = process.env.NODE_ENV || "development";
const config = require("../../../config/config.json")[env];

const setPassword = async password => {
    return await bcrypt.hash(password, 10);
};

const checkPassword = async (name, password) => {
    const userPassword = await User.findOne({where: {name: name}}).catch(e => console.log(e));
    return await bcrypt.compare(password, userPassword.password);
}

exports.register = async ctx => {
    const {name, password} = ctx.request.body;

    const exists = await User.findOne({where: {name: name}}).catch(e => console.log(e));

    if(exists) {
        ctx.status = 409;
        return;
    }

    const userPassword = await setPassword(password);

    const user = {
        name: name,
        password: userPassword
    }

    await User.create(user).catch(e=>console.log(e));

    delete user.password;

    const userOut = await User.findOne({where: {name: name}}).catch(e => console.log(e));

    ctx.body = userOut;

    const token = jwtGenerator(userOut, config.jwt_secret);

    ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    });
};

exports.login = async ctx => {
    const {name, password} = ctx.request.body;

    if(!name || !password) {
        ctx.status = 401;
        return;
    }

    const user = await User.findOne({where: {name: name}}).catch(e => console.log(e));

    if(!user) {
        ctx.status = 401;
        return;
    }

    const valid = await checkPassword(user.name, password);

    if(!valid) {
        ctx.status = 401;
        return;
    }
    ctx.body = user;

    const token =  jwtGenerator(user, config.jwt_secret);

    ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
    });
};

exports.check = async ctx => {
    const {user} = ctx.state;
    if(!user) {
        ctx.status = 401;
        return;
    }

    ctx.body = user;
};

exports.logout = async ctx => {
    ctx.cookies.set('access_token');
    ctx.status = 204;
};