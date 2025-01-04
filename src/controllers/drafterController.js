import modelDrafter from '../models/drafter.js';
import modelSopDetail from '../models/sop_details.js';
import modelUser from '../models/users.js';
import modelRole from '../models/roles.js';
import { Op } from 'sequelize';

const getAllDrafter = async (req, res, next) => {
    try {
        const pic = await modelUser.findAll({
            attributes: ['id_user', 'identity_number', 'name'],
            include: {
                model: modelRole,
                attributes: ['role_name'],
                where: {
                    role_name:  ['penyusun', 'pj', 'kaprodi'] // Mengambil role_name yang sesuai
                }
            }
        });

        const data = pic.map(item => ({
            id: item.id_user,
            identity_number: item.identity_number,
            name: item.name,
            role: item.role.role_name
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

export { getAllDrafter, getDrafterByIdDetail, addSopDrafter };
