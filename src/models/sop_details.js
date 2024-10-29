import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

const sop_details = sequelize.define('sop_details' ,
    {
        id_sop_detail: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        }, 
        id_sop: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        sop_number: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        version: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        revision_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        effective_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        is_approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('processing', 'approved'),
            allowNull: false,
        },
        warning: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        section: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        sop_description: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        implementer: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        position_of_the_person_in_charge: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

export default sop_details;
