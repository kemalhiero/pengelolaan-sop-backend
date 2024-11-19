import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

const legal_basis = sequelize.define('legal_basis' ,
    {
        id_legal: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        id_law_type: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false
        }, 
        number: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false,
            validate: {
                min: 1,
                max: 999
            }
        },
        year: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false,
            validate: {
                min: 1945,
                max: new Date().getFullYear(),
            }
        },
        about: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

export default legal_basis;
