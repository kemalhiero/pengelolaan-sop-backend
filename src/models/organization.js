import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

export default sequelize.define('organization' ,
    {
        id_org: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        org_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        org_about: {
            type: DataTypes.STRING(300),
        },
    }, {
        freezeTableName: true
    }
);
