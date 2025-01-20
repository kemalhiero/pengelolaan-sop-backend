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
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        about: {
            type: DataTypes.STRING(300),
        },
        id_org_parent: {
            type: DataTypes.TINYINT.UNSIGNED,
            defaultValue: 0
        },
    }, {
        freezeTableName: true
    }
);
