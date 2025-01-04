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
            unique: true
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
