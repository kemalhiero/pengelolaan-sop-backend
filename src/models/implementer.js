import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

const implementer = sequelize.define('implementer' ,
    {
        id_implementer: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        implementer_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(300),
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

export default implementer;
