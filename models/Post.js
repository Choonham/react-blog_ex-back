module.exports = (sequelize, DataTypes) => (
    sequelize.define(
        "Post",
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            body: {
                type: DataTypes.STRING
            },
            tags: {
                type: DataTypes.STRING
            },
            writer: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            timestamps: false
        }
    )
);