import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

export default sequelize.define('reset_token',
    {
        id_token: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_user: {
            type: DataTypes.STRING(15),
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        expiry_date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
    freezeTableName: true,
    timestamps: false
}
);
