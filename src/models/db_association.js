import modelDataRecord from './data_record.js';
import modelDrafter from './drafter.js';
import modelEquipment from './equipment.js';
import modelFeedback from './feedback.js';
import modelImplementQualification from './implement_qualification.js';
import modelLawTypes from './law_types.js';
import modelLegalBasisSopDetail from './legal_basis_sop_details.js';
import modelLegal from './legal_basis.js';
import modelOrganization from './organization.js';
import modelRelationOtherSop from './relation_other_sop.js';
import modelRoles from './roles.js';
import modelSopDetails from './sop_details.js';
import modelStepImplementer from './sop_step_implementer.js';
import modelStep from './sop_step.js';
import modelSop from './sop.js';
import modelUser from './users.js';

// relasi one to many
modelRoles.hasMany(modelUser, { foreignKey: 'id_role' });
modelUser.belongsTo(modelRoles, { foreignKey: 'id_role' });

modelUser.hasMany(modelFeedback,{ foreignKey: 'id_user' });
modelFeedback.belongsTo(modelUser,{ foreignKey: 'id_user' });

modelUser.hasMany(modelOrganization,{ foreignKey: 'person_in_charge' });
modelOrganization.belongsTo(modelUser,{ foreignKey: 'person_in_charge' });

modelLawTypes.hasMany(modelLegal, { foreignKey: 'id_law_type' });
modelLegal.belongsTo(modelLawTypes, { foreignKey: 'id_law_type' });

modelSopDetails.hasMany(modelFeedback,{ foreignKey: 'id_sop_detail' });
modelFeedback.belongsTo(modelSopDetails,{ foreignKey: 'id_sop_detail' });

modelSop.hasMany(modelSopDetails,{ foreignKey: 'id_sop' });
modelSopDetails.belongsTo(modelSop,{ foreignKey: 'id_sop' });

modelSopDetails.hasMany(modelEquipment,{ foreignKey: 'id_sop_detail' });
modelEquipment.belongsTo(modelSopDetails,{ foreignKey: 'id_sop_detail' });

modelSopDetails.hasMany(modelDataRecord,{ foreignKey: 'id_sop_detail' });
modelDataRecord.belongsTo(modelSopDetails,{ foreignKey: 'id_sop_detail' });

modelSopDetails.hasMany(modelImplementQualification,{ foreignKey: 'id_sop_detail' });
modelImplementQualification.belongsTo(modelSopDetails,{ foreignKey: 'id_sop_detail' });

modelSopDetails.hasMany(modelStep,{ foreignKey: 'id_sop_detail' });
modelStep.belongsTo(modelSopDetails,{ foreignKey: 'id_sop_detail' });

modelSopDetails.hasMany(modelRelationOtherSop,{ foreignKey: 'id_sop_detail' });
modelRelationOtherSop.belongsTo(modelSopDetails,{ foreignKey: 'id_sop_detail' });

modelOrganization.hasMany(modelSop,{ foreignKey: 'id_org' });
modelSop.belongsTo(modelOrganization,{ foreignKey: 'id_org' });

modelStepImplementer.hasMany(modelStep, { foreignKey: 'id_sop_implementer' });
modelStep.belongsTo(modelStepImplementer,{ foreignKey: 'id_sop_implementer' });

// relasi many to many
modelUser.belongsToMany(modelSopDetails, { through: modelDrafter });
modelSopDetails.belongsToMany(modelUser, { through: modelDrafter });

modelLegal.belongsToMany(modelSopDetails, { through: modelLegalBasisSopDetail });
modelSopDetails.belongsToMany(modelLegal, { through: modelLegalBasisSopDetail });

// self referencing
modelOrganization.hasMany(modelOrganization, { foreignKey: 'id_org_parent', as: 'children' });
modelOrganization.belongsTo(modelOrganization, { foreignKey: 'id_org_parent', as: 'parent' });

    //sop step ada 2 self referencing
