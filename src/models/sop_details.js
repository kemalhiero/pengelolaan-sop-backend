import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

import modelUser from './users.js';

export default sequelize.define('sop_details',
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
        number: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        version: {
            type: DataTypes.SMALLINT.UNSIGNED,
            allowNull: false
        },
        effective_date: {
            type: DataTypes.DATE
        },
        status: {
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
        description: {         // bisa tapi tidak wajib saat di awal
            type: DataTypes.STRING(1000),
            validate: {
                len: [0, 1000],
            },
        },
        signer_id: {
            type: DataTypes.STRING(15),
            allowNull: false,
            references: {
                model: modelUser,
                key: 'id_user',
            },
        },
        signature_url: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
    freezeTableName: true,
}
);
