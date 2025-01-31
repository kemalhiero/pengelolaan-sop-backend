import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

export default sequelize.define('verification_code',
    {
        id_code: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
        },
        id_user: {
            type: DataTypes.STRING(15),
            allowNull: false,
            references: {
                model: 'users',
                key: 'id_user'
            }
        },
        code: {
            type: DataTypes.STRING(10),
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
