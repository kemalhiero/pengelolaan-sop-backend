import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';
import modelSopDetail from './sop_details.js';
import modelSop from './sop.js';

export default sequelize.define('relation_other_sop',
    {
        id_sop_detail: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            references: {
                model: modelSopDetail,
                key: 'id_sop_detail'
            }
        },
        id_sop: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            references: {
                model: modelSop,
                key: 'id_sop'
            }
        },
    }, {
    freezeTableName: true,
    timestamps: false,
}
);
