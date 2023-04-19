const jwt = require("jsonwebtoken");

module.exports = (user, secret) => {
    return  jwt.sign(
        {
            id: user.id,
            name: user.name
        },
        secret,
        {
            expiresIn: '3d'
        },
    );
}