import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

export default sequelize.define('sop_step',
    {
        id_step: {
            type: DataTypes.STRING(25),
            primaryKey: true,
            allowNull: false
        },
        id_sop_detail: {
            type: DataTypes.UUID,
            allowNull: false
        },
        id_next_step_if_no: {
            type: DataTypes.STRING(25)
        },
        id_next_step_if_yes: {
            type: DataTypes.STRING(25)
        },
        seq_number: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('terminator', 'task', 'decision'),
            allowNull: false,
        },
        id_implementer: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
        },
        fittings: {
            type: DataTypes.STRING(200)
        },
        time: {
            type: DataTypes.TINYINT.UNSIGNED,
            allowNull: false,
        },
        time_unit: {
            type: DataTypes.ENUM('h', 'm', 'd', 'w', 'mo', 'y'),
            defaultValue: 'h',
            allowNull: false,
        },
        output: {
            type: DataTypes.STRING(100)
        },
        description: {
            type: DataTypes.STRING(300)
        },

    }, {
    freezeTableName: true
}
);
