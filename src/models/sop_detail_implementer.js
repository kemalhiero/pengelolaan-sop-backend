import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';
import modelSopDetail from './sop_details.js';
import modelImplementer from './implementer.js';

export default sequelize.define('sop_detail_implementer',
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
        id_implementer: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            references: {
                model: modelImplementer,
                key: 'id_implementer'
            }
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);
