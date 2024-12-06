import modelDrafter from '../models/drafter.js';
import modelSopDetail from '../models/sop_details.js';
import modelUser from '../models/users.js';

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

const getDrafter = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
};

export { getDrafter, addSopDrafter };
