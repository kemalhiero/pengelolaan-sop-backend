import modelSop from './sop.js';
import modelUser from './users.js';
import modelRoles from './roles.js';
import modelStep from './sop_step.js';
import modelDrafter from './drafter.js';
import modelFeedback from './feedback.js';
import modelLegal from './legal_basis.js';
import modelLawTypes from './law_types.js';
import modelEquipment from './equipment.js';
import modelDataRecord from './data_record.js';
import modelSopDetails from './sop_details.js';
import modelOrganization from './organization.js';
import modelRelationOtherSop from './relation_other_sop.js';
import modelStepImplementer from './sop_step_implementer.js';
import modelSopDetailImplementer from './sop_detail_implementer.js';
import modelLegalBasisSopDetail from './legal_basis_sop_details.js';
import modelImplementQualification from './implement_qualification.js';

// relasi one to many
modelRoles.hasMany(modelUser, { foreignKey: 'id_role' });
modelUser.belongsTo(modelRoles, { foreignKey: 'id_role' });

modelSop.hasMany(modelSopDetails, { foreignKey: 'id_sop' });
modelSopDetails.belongsTo(modelSop, { foreignKey: 'id_sop' });

modelUser.hasMany(modelFeedback, { foreignKey: 'id_user' });
modelFeedback.belongsTo(modelUser, { foreignKey: 'id_user' });

modelOrganization.hasMany(modelSop, { foreignKey: 'id_org' });
modelSop.belongsTo(modelOrganization, { foreignKey: 'id_org' });

modelLawTypes.hasMany(modelLegal, { foreignKey: 'id_law_type' });
modelLegal.belongsTo(modelLawTypes, { foreignKey: 'id_law_type' });

modelSopDetails.hasMany(modelStep, { foreignKey: 'id_sop_detail' });
modelStep.belongsTo(modelSopDetails, { foreignKey: 'id_sop_detail' });

modelSopDetails.hasMany(modelFeedback, { foreignKey: 'id_sop_detail' });
modelFeedback.belongsTo(modelSopDetails, { foreignKey: 'id_sop_detail' });

modelUser.hasMany(modelOrganization, { foreignKey: 'person_in_charge' });
modelOrganization.belongsTo(modelUser, { foreignKey: 'person_in_charge' });

modelSopDetails.hasMany(modelEquipment, { foreignKey: 'id_sop_detail' });
modelEquipment.belongsTo(modelSopDetails, { foreignKey: 'id_sop_detail' });

modelSopDetails.hasMany(modelDataRecord, { foreignKey: 'id_sop_detail' });
modelDataRecord.belongsTo(modelSopDetails, { foreignKey: 'id_sop_detail' });

modelStepImplementer.hasMany(modelStep, { foreignKey: 'id_sop_implementer' });
modelStep.belongsTo(modelStepImplementer, { foreignKey: 'id_sop_implementer' });

modelSopDetails.hasMany(modelRelationOtherSop, { foreignKey: 'id_sop_detail' });
modelRelationOtherSop.belongsTo(modelSopDetails, { foreignKey: 'id_sop_detail' });

modelSopDetails.hasMany(modelImplementQualification, { foreignKey: 'id_sop_detail' });
modelImplementQualification.belongsTo(modelSopDetails, { foreignKey: 'id_sop_detail' });

// relasi many to many
modelUser.belongsToMany(modelSopDetails, { through: modelDrafter, foreignKey: 'id_user' });
modelSopDetails.belongsToMany(modelUser, { through: modelDrafter, foreignKey: 'id_sop_detail' });

modelLegal.belongsToMany(modelSopDetails, { through: modelLegalBasisSopDetail, foreignKey: 'id_legal' });
modelSopDetails.belongsToMany(modelLegal, { through: modelLegalBasisSopDetail, foreignKey: 'id_sop_detail' });

modelStepImplementer.belongsToMany(modelSopDetails, { through: modelSopDetailImplementer, foreignKey: 'id_sop_implementer' });
modelSopDetails.belongsToMany(modelStepImplementer, { through: modelSopDetailImplementer, foreignKey: 'id_sop_detail' });

// self referencing
modelOrganization.hasMany(modelOrganization, { foreignKey: 'id_org_parent', as: 'children' });
modelOrganization.belongsTo(modelOrganization, { foreignKey: 'id_org_parent', as: 'parent' });

//sop step ada 2 self referencing
