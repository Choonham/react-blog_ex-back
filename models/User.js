module.exports = (sequelize, DataTypes) => (
    sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            password: {
                type: DataTypes.STRING
            }
        },
        {
            timestamps: false
        }
    )
);