import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

export default sequelize.define('sop',
    {
        id_sop: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_org: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                len: {
                    args: [5, 100],
                    msg: "Nama harus terdiri dari minimal 5 dan maksimal 100 karakter."
                }
            },
        },
        is_active: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
            defaultValue: 2
        },
    }, {
    freezeTableName: true
}
);
