import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

export default sequelize.define('implementer',
    {
        id_implementer: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
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
