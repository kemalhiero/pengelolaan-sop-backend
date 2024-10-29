import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';
import modelLegalBasis from './legal_basis.js';
import modelSopDetail from './sop_details.js'

const legal_basis_sop_details = sequelize.define('legal_basis_sop_details' ,
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
        id_legal: {
            type: DataTypes.SMALLINT.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            references: {
                model: modelLegalBasis,
                key: 'id_legal'
            }
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    }
);

export default legal_basis_sop_details;
