import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

export default sequelize.define('feedback',
    {
        id_feedback: {
            type: DataTypes.STRING(25),
            primaryKey: true,
            allowNull: false
        },
        id_user: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        id_sop_detail: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        feedback: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        is_internal: {
            type: DataTypes.BOOLEAN(),
            defaultValue: false,
            allowNull: false
        },
    }, {
    freezeTableName: true
}
);
