import sequelize from "../config/db.js";
import { DataTypes } from 'sequelize';

import modelSopDetail from './sop_details.js';

export default sequelize.define('sop_display_config',
    {
        id_sop_detail: {
            primaryKey: true,
            type: DataTypes.STRING(15),
            references: {
                model: modelSopDetail,
                key: 'id_sop_detail',
            },
        },
        nominal_basic_page_steps: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        nominal_steps_both_opc: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        kegiatan_width: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        kelengkapan_width: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        waktu_width: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        output_width: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        ket_width: {
            type: DataTypes.TINYINT.UNSIGNED,
        },
        flowchart_arrow_config: {
            type: DataTypes.TEXT("long"),
        },
        bpmn_arrow_config: {
            type: DataTypes.TEXT("long"),
        },
        flowchart_label_config: {
            type: DataTypes.TEXT("long"),
        },
        bpmn_label_config: {
            type: DataTypes.TEXT("long"),
        },
    }, {
    freezeTableName: true,
}
);