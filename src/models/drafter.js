import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';
import modelSopDetail from './sop_details.js';
import modelUser from './users.js';

export default sequelize.define('drafter',
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
        id_user: {
            type: DataTypes.STRING(15),
            primaryKey: true,
            allowNull: false,
            references: {
                model: modelUser,
                key: 'id_user'
            }
        },
    }, {
    freezeTableName: true,
    timestamps: false,
}
);
