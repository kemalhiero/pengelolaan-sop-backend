import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

export default sequelize.define('relation_other_sop',
    {
        id_relation_sop: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_sop_detail: {
            type: DataTypes.UUID,
            allowNull: false
        },
        related_sop: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
    }, {
    freezeTableName: true,
    timestamps: false,
}
);
