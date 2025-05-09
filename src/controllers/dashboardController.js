import modelOrganization from '../models/organization.js';
import modelSopDetail from '../models/sop_details.js';
import modelFeedback from '../models/feedback.js';
import modelUser from '../models/users.js';
import modelRole from '../models/roles.js';
import modelSop from '../models/sop.js';

// beranda
const nominalSopEachOrg = async (req, res, next) => {
    try {
        const organization = await modelOrganization.findAll({
            attributes: ['name'],
            include: {
                model: modelSop,
                attributes: ['id_sop'],
                where: {
                    is_active: 1        // hanya sop yang berlaku yang ditampilkan, karena ini bersifat publik
                },
                include: {
                    model: modelSopDetail,
                    attributes: [['id_sop_detail', 'id']],
                    where: {
                        status: 1        // hanya sop yang berlaku yang ditampilkan, karena ini bersifat publik
                    },
                }
            }
        });

        const data = organization.map(item => ({
            name: item.name,
            total_sop: item.sops.reduce((total, sop) => {
                return total + sop.sop_details.length;
            }, 0)
        }));

        return res.status(200).json({
            message: 'sukses mendapat data',
            data
        });
    } catch (error) {
        next(error)
    }
};

const sopDistributionByStatus = async (req, res, next) => {
    try {
        const dataSop = await modelSopDetail.findAll({
            attributes: ['status'],
            include: [
                {
                    model: modelSop,
                    attributes: ['is_active']
                },
            ]
        });

        // Inisialisasi counter
        const result = {
            tidak_berlaku: 0,
            berlaku: 0,
            proses: 0
        };

        dataSop.forEach(item => {
            const is_active = item.sop.is_active;
            const status = item.status;

            if (is_active === 0 || status === 0) {
                result.tidak_berlaku += 1;
            } else if (is_active === 1 && status === 1) {
                result.berlaku += 1;
            } else {
                result.proses += 1;
            }
        });

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: result
        });
    } catch (error) {
        next(error)
    }
};

// dashboard admin
const nominalSopEachOrgByStatus = async (req, res, next) => {
    try {
        const organization = await modelOrganization.findAll({
            attributes: ['name'],
            include: {
                model: modelSop,
                attributes: ['id_sop'],
                include: {
                    model: modelSopDetail,
                    attributes: [['id_sop_detail', 'id'], 'status'],
                }
            }
        });

        const data = organization.map(item => {
            const total = item.sops.reduce((total, sop) => {
                return total + sop.sop_details.length;
            }, 0);

            const berlaku = item.sops.reduce((total, sop) => {
                return total + sop.sop_details.filter(sopDetail => sopDetail.status === 1).length;
            }, 0);

            const tidak_berlaku = item.sops.reduce((total, sop) => {
                return total + sop.sop_details.filter(sopDetail => sopDetail.status === 0).length;
            }, 0);

            const progress = item.sops.reduce((total, sop) => {
                return total + sop.sop_details.filter(sopDetail => sopDetail.status >= 2).length;
            }, 0);

            return {
                name: item.name,
                total_sop: {
                    total, berlaku, tidak_berlaku, progress
                }
            };
        });

        return res.status(200).json({
            message: 'sukses mendapat data',
            data
        });
    } catch (error) {
        next(error)
    }
};

const annualSopMakingTrend = async (req, res, next) => {
    try {
        const where = req.user.role === 'pj' ? {
            include: {
                model: modelSop,
                where: { id_org: req.user.id_org_pic },
                attributes: []
            }
        } : {};

        const dataSop = await modelSopDetail.findAll({
            attributes: ['createdAt'],
            ...where
        });

        const result = dataSop.reduce((acc, item) => {
            const year = new Date(item.createdAt).getFullYear();
            acc[year] = (acc[year] || 0) + 1;
            return acc;
        }, {});

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: result
        });
    } catch (error) {
        next(error)
    }
};

const nominalUserEachRole = async (req, res, next) => {
    try {
        const where = req.user.role === 'pj' ? { id_org_pic: req.user.id_org_pic } : {};
        const dataUser = await modelUser.findAll({
            attributes: ['id_role'],
            include: {
                model: modelRole,
                attributes: ['role_name']
            },
            where
        });

        const result = dataUser.reduce((acc, item) => {
            const roleName = item.role.role_name;
            acc[roleName] = (acc[roleName] || 0) + 1;
            return acc;
        }, {});

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: result
        });
    } catch (error) {
        next(error)
    }
};

const nominalFeedbackTopSop = async (req, res, next) => {
    try {
        let dataFeedback = [];
        const feedbackOptions = {
            attributes: ['id_sop_detail'],
            include: {
                model: modelSopDetail,
                attributes: ['id_sop'],
                include: {
                    model: modelSop,
                    attributes: ['name'],
                    include: {
                        model: modelOrganization,
                        attributes: ['name']
                    }
                }
            },
            where: { type: 'umum' },
            limit: 8,
            order: [['createdAt', 'DESC']]
        };

        if (req.user.role === 'pj') {
            feedbackOptions.include.include.where = { id_org: req.user.id_org_pic };
        }

        dataFeedback = await modelFeedback.findAll(feedbackOptions);

        // Jika semua item sop_detail null, kembalikan array kosong
        if (dataFeedback.every(item => item.sop_detail === null)) {
            return res.status(200).json({
                message: 'sop dengan organisasi yang diminta tidak ada',
                data: []
            });
        }

        const resultObj = dataFeedback.reduce((acc, item) => {
            const sopName = item.sop_detail?.sop.name;
            const orgName = item.sop_detail?.sop.organization.name;
            const key = `${sopName}||${orgName}`;
            acc[key] = acc[key] || { name: sopName, org: orgName, count: 0 };
            acc[key].count += 1;
            return acc;
        }, {});

        const result = Object.values(resultObj);

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: result
        });
    } catch (error) {
        next(error)
    }
};

const mostRevisedSop = async (req, res, next) => {
    try {
        const sopInclude = {
            model: modelSop,
            attributes: ['name'],
            include: {
                model: modelOrganization,
                attributes: ['name']
            }
        };

        // Tambahkan filter organisasi jika role 'pj'
        if (req.user.role === 'pj') {
            sopInclude.where = { id_org: req.user.id_org_pic };
        }

        const dataSop = await modelSopDetail.findAll({
            attributes: ['id_sop'],
            include: sopInclude,
            order: [['updatedAt', 'DESC']],
            limit: 8
        });

        const resultObj = dataSop.reduce((acc, item) => {
            const sopName = item.sop?.name;
            const orgName = item.sop?.organization.name;
            const key = `${sopName}||${orgName}`;
            acc[key] = acc[key] || { name: sopName, org: orgName, count: 0 };
            acc[key].count += 1;
            return acc;
        }, {});

        const result = Object.values(resultObj);

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: result
        });
    } catch (error) {
        next(error)
    }
};

const sopOrgDistributionByStatus = async (req, res, next) => {
    try {
        const dataSop = await modelSopDetail.findAll({
            attributes: ['status'],
            include: [
                {
                    model: modelSop,
                    attributes: ['is_active'],
                    where: {
                        id_org: req.user.id_org_pic
                    }
                },
            ]
        });

        // Inisialisasi counter
        const result = {
            tidak_berlaku: 0,
            berlaku: 0,
            proses: 0
        };

        dataSop.forEach(item => {
            const is_active = item.sop.is_active;
            const status = item.status;

            if (is_active === 0 || status === 0) {
                result.tidak_berlaku += 1;
            } else if (is_active === 1 && status === 1) {
                result.berlaku += 1;
            } else {
                result.proses += 1;
            }
        });

        return res.status(200).json({
            message: 'sukses mendapatkan data',
            data: result
        });
    } catch (error) {
        next(error)
    }
};

export {
    nominalSopEachOrg, sopDistributionByStatus,
    nominalSopEachOrgByStatus, annualSopMakingTrend, nominalUserEachRole,
    nominalFeedbackTopSop, mostRevisedSop, sopOrgDistributionByStatus
};
