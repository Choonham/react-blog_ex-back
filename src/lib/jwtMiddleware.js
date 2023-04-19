const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || "development";
const config = require("../../config/config.json")[env];

const db = require("../../models");
const jwtGenerator = require("./jwtGenerator");

const User = db.user;

const jwtMiddleware = async (ctx, next) => {
    const token = ctx.cookies.get('access_token');

    if(!token) return next();

    try{
        const decoded = jwt.verify(token, config.jwt_secret);

        ctx.state.user = {
            id: decoded.id,
            name: decoded.name
        };

        const now = Math.floor(Date.now() / 1000);
        if(decoded.exp - now < 60*60*24*3.5) {
            const user = await User.findByPk(decoded.id);
            const token =  jwtGenerator(user, config.jwt_secret);

            ctx.cookies.set('access_token', token, {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
            })
        }

        return next();
    } catch (e) {
        return next();
    }
};

module.exports = jwtMiddleware;