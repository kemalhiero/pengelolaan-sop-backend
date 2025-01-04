import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

export default sequelize.define('sop_details',
    {
        id_sop_detail: {        // data awal yang dimasukkan
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_sop: {               //
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        number: {               //
            type: DataTypes.STRING(50),
            allowNull: false
        },
        version: {              //
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        revision_date: {
            type: DataTypes.DATE
        },
        effective_date: {
            type: DataTypes.DATE
        },
        is_approved: {          //
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        status: {               //
            type: DataTypes.TINYINT.UNSIGNED,
            defaultValue: 0,
            allowNull: false,
        },
        warning: {
            type: DataTypes.STRING(100)
        },
        section: {
            type: DataTypes.STRING(100),
        },
        description: {          // bisa tapi tidak wajib saat di awal
            type: DataTypes.STRING(1000),
        },
        pic_position: {
            type: DataTypes.STRING(50)
        },
    }, {
    freezeTableName: true,
}
);
