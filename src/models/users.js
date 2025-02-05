import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';
import modelOrg from './organization.js';
import modelRole from './roles.js';

export default sequelize.define('users',
    {
        id_user: {
            type: DataTypes.STRING(15),
            primaryKey: true,
            allowNull: false
        },
        identity_number: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        gender: {
            type: DataTypes.ENUM('pria', 'wanita'),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['pria', 'wanita']],
                    msg: 'Gender harus diisi dengan "pria" atau "wanita"'
                }
            }
        },
        photo: {
            type: DataTypes.STRING(200),
        },
        signature: {
            type: DataTypes.STRING(200),
        },
        id_role: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
            references: {
                model: modelRole,
                key: 'id_role'
            }
        },
        id_org_pic: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: true,
            references: {
                model: modelOrg,
                key: 'id_org'
            }
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);
