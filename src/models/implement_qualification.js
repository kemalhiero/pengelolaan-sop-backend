import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

export default sequelize.define('implement_qualification',
    {
        id_qualification: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_sop_detail: {
            type: DataTypes.UUID,
            allowNull: false
        },
        qualification: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
    }, {
    freezeTableName: true,
    timestamps: false,
}
);
