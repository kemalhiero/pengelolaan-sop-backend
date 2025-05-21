import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

export default sequelize.define('data_record' ,
    {
        id_data_record: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        id_sop_detail: {
            type: DataTypes.UUID,
            allowNull: false
        },
        data_record: {
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
