import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

export default sequelize.define('equipment' ,
    {
        id_equipment: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        id_sop_detail: {
            type: DataTypes.UUID,
            allowNull: false
        },
        equipment: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(300)
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);
