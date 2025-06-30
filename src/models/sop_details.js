import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

import modelUser from './users.js';

export default sequelize.define('sop_details',
    {
        id_sop_detail: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            validate: {
                isUUID: {
                    args: 4,
                    msg: 'ID SOP Detail harus berupa UUID v4 yang valid.'
                }
            }
        },
        id_sop: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        number: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: {
                msg: 'Nomor tersebut sudah digunakan. Gantikan dengan nomor lain.'
            }
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
            type: DataTypes.STRING(1000)
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
        pic_position: {
            type: DataTypes.STRING(20),
            validate: {
                len: [0, 20],
            },
        },
        signer_id: {
            type: DataTypes.STRING(15),
            references: {
                model: modelUser,
                key: 'id_user',
            },
        },
        signature_url: {
            type: DataTypes.STRING(255),
        },
    }, {
    freezeTableName: true,
}
);
