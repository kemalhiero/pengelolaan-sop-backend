import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';
import modelSopDetail from './sop_details.js';
import modelSopImplementer from './sop_step_implementer.js';


const sop_detail_implementer = sequelize.define('sop_detail_implementer',
    {
        id_sop_detail: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            references: {
                model: modelSopDetail,
                key: 'id_sop_detail'
            }
        },
        id_sop_implementer: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            references: {
                model: modelSopImplementer,
                key: 'id_sop_implementer'
            }
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

export default sop_detail_implementer;
