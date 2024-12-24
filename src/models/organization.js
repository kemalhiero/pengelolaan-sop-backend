import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

const organization = sequelize.define('organization' ,
    {
        id_org: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        person_in_charge: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        org_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        org_level: {
            type: DataTypes.ENUM('departemen', 'laboratorium'),
            allowNull: false
        },
        org_about: {
            type: DataTypes.STRING(300),
        },
        id_org_parent: {
            type: DataTypes.TINYINT.UNSIGNED,
        }, 
    }, {
        freezeTableName: true
    }
);

export default organization;
