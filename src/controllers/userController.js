import { Op, literal } from 'sequelize';
import modelDrafter from '../models/drafter.js';
import modelSopDetail from '../models/sop_details.js';
import modelUser from '../models/users.js';
import modelRole from '../models/roles.js';
import modelOrg from '../models/organization.js';

const getUserByRole = async (req, res, next) => {
    try {
        const { role } = req.query;
        if (!role) return res.status(400).json({ message: 'Parameter role harus disertakan' });

        let dataRole = await modelRole.findAll({
            attributes: ['role_name']
        });
        dataRole = dataRole.map(item => item.role_name);

        const requestedRoles = role.split(',');
        const invalidRoles = requestedRoles.filter(r => !dataRole.includes(r));
        if (invalidRoles.length > 0) {
            return res.status(400).json({
                message: `Role tidak valid: ${invalidRoles.join(', ')}. Role yang tersedia: ${dataRole.join(', ')}`
            });
        }

        const user = await modelUser.findAll({
            attributes: ['id_user', 'identity_number', 'name'],
            include: {
                model: modelRole,
                where: {
                    role_name: {
                        [Op.or]: requestedRoles
                    }
                },
                attributes: []
            }
        });

        const data = user.map(item => ({
            id: item.id_user,
            id_number: item.identity_number,
            name: item.name
        }));

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data,
        });

    } catch (error) {
        next(error);
    }
};

const getAllPic = async (req, res, next) => {
    try {
        const pic = await modelUser.findAll({
            attributes: ['id_user', 'identity_number', 'name'],
            include: [
                {
                    model: modelRole,
                    attributes: [],
                    where: {
                        role_name: 'pj'
                    }
                },
                {
                    model: modelOrg,
                    attributes: ['org_name']
                }
            ]
        });

        const data = pic.map(item => {
            return {
                id: item.id_user,
                id_number: item.identity_number,
                name: item.name,
                org: item.organization?.org_name || '-'
            }
        });

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });
    } catch (error) {
        next(error);
    }
};

const addPic = async (req, res, next) => {
    try {
        const { id } = req.body;

        const pic = await modelUser.findByPk(id, {
            attributes: ['id_user'],
            include: {
                model: modelRole,
                attributes: ['role_name']
            }
        });
        if (!pic) return res.status(404).json({ message: 'user tidak ditemukan!' });
        if (pic.dataValues.role.role_name === 'pj') return res.status(404).json({ message: 'user ini sudah menjadi penanggung jawab!' })

        const role = await modelRole.findOne({
            where: { role_name: 'pj' },
            attributes: ['id_role']
        });

        await pic.update({
            id_role: role.id_role
        });

        return res.status(200).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

const getAllDrafter = async (req, res, next) => {
    try {
        const pic = await modelUser.findAll({
            attributes: ['id_user', 'identity_number', 'name'],
            include: [
                {
                    model: modelRole,
                    attributes: [],
                    where: {
                        role_name: 'penyusun' // Mengambil role_name yang sesuai
                    }
                },
                {
                    model: modelSopDetail,
                    attributes: ['id_sop_detail'],
                    through: { attributes: [] }
                }
            ]
        });

        const data = pic.map(item => ({
            id: item.id_user,
            id_number: item.identity_number,
            name: item.name,
            status: item.sop_details.length > 0 ? 1 : 0
        }));

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });

    } catch (error) {
        next(error);
    }
};

const addSopDrafter = async (req, res, next) => {
    try {
        const { id_user, id_sop_detail } = req.body;

        const dataUser = await modelUser.findByPk(id_user);
        const dataSopDetail = await modelSopDetail.findByPk(id_sop_detail);

        if (!dataUser || !dataSopDetail) {
            const error = new Error('Data user atau sop tidak ditemukan');
            error.status = 404;
            throw error;
        };

        await modelDrafter.create({
            id_user, id_sop_detail
        });

        return res.status(200).json({
            message: 'sukses menambahkan data',
        });
    } catch (error) {
        next(error);
    }
};

const getDrafterByIdDetail = async (req, res, next) => {      //ambil pembuat dokumen berdasarkan id detail sop
    try {
        const { id } = req.params;
        const dataSopDetail = await modelSopDetail.findByPk(id);

        if (!dataSopDetail) {
            const error = new Error('Data sop tidak ditemukan');
            error.status = 404;
            throw error;
        };

        const drafter = await modelUser.findAll({
            include: {
                model: modelSopDetail,
                where: { id_sop_detail: id },
                attributes: []
            },
            attributes: ['identity_number', 'name']
        });

        return res.status(200).json({
            message: 'sukses mengambil data',
            data: drafter
        });

    } catch (error) {
        next(error);
    }
};

const addDrafter = async (req, res, next) => {
    try {
        const { id } = req.body;

        const drafter = await modelUser.findByPk(id, {
            attributes: ['id_user'],
            include: {
                model: modelRole,
                attributes: ['role_name']
            }
        });
        if (!drafter) return res.status(404).json({ message: 'user tidak ditemukan!' });
        if (drafter.dataValues.role.role_name === 'penyusun') return res.status(404).json({ message: 'user ini sudah menjadi penyusun!' })

        const role = await modelRole.findOne({
            where: { role_name: 'penyusun' },
            attributes: ['id_role']
        });

        await drafter.update({
            id_role: role.id_role
        });

        return res.status(200).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

// Kepala departemen
const getHodCandidate = async (req, res, next) => {
    try {
        const hodCandidate = await modelUser.findAll({
            where: {
                // Menggunakan sequelize.literal untuk menggunakan fungsi MySQL LENGTH
                [Op.and]: [
                    literal('LENGTH(REPLACE(identity_number, "-", "")) = 18')
                ]
            },
            attributes: ['id_user', 'identity_number', 'name', 'email'],
            include: {
                model: modelRole,
                attributes: [],
                where: { role_name: { [Op.ne]: 'kadep' } }
            }
        });

        const data = hodCandidate.map(item => ({
            id: item.id_user,
            id_number: item.identity_number,
            name: item.name,
            email: item.email
        }));

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });

    } catch (error) {
        next(error);
    }
};

const addHod = async (req, res, next) => {
    try {
        const { id } = req.body;

        const hod = await modelUser.findByPk(id, {
            attributes: ['id_user'],
            include: {
                model: modelRole,
                attributes: ['role_name']
            }
        });
        if (!hod) return res.status(404).json({ message: 'user tidak ditemukan!' });
        if (hod.dataValues.role.role_name === 'kadep') return res.status(404).json({ message: 'user ini sudah menjadi kadep!' })

        const role = await modelRole.findOne({
            where: { role_name: 'kadep' },
            attributes: ['id_role']
        })

        await hod.update({
            id_role: role.id_role
        });

        return res.status(200).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

export {
    getUserByRole,
    getAllDrafter, getDrafterByIdDetail, addSopDrafter, addDrafter,
    getHodCandidate, addHod,
    getAllPic, addPic,
};
