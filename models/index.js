const { Sequelize, DataTypes } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config.json")[env];

const db = {};

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

sequelize
    .sync({ force: false })
    .then(() => {
      console.log("데이터베이스 연결됨.");
      module.exports = db;
    })
    .catch((err) => {
      console.error(err);
    });

const Posts = require("./Post")(sequelize, DataTypes);
const Users = require("./User")(sequelize, DataTypes);

db.post = Posts;
db.user = Users;

db.user.hasMany(db.post, {
    foreignKey: 'writer'
});
db.post.belongsTo(db.user, {
    foreignKey: 'writer'
});

module.exports = db;