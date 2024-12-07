import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

const equipment = sequelize.define('equipment' ,
    {
        id_equipment: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        id_sop_detail: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        equipment: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        equipment_description: {
            type: DataTypes.STRING(300)
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

export default equipment;
