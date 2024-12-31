import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

const users = sequelize.define('users' ,
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
        id_role: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false
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

export default users;
