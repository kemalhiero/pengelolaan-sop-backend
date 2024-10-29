import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

const roles = sequelize.define('roles' ,
    {
        id_role: {
            type: DataTypes.TINYINT.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        }, 
        role_name: {
            type: DataTypes.STRING(20),
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

export default roles;
