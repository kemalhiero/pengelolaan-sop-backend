import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";
import modelUser from './users.js';
import modelOrg from './organization.js';

export default sequelize.define('person_in_charge',
    {
        id_user: {
            type: DataTypes.STRING(100),
            primaryKey: true,
            allowNull: false,
            references: {
                model: modelUser,
                key: 'id_user'
            }
        },
        id_org: {
            type: DataTypes.TINYINT.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            references: {
                model: modelOrg,
                key: 'id_org'
            }
        },
    }, {
    freezeTableName: true,
    timestamps: false,
}
);
