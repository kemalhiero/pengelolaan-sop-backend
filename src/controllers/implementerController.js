import modelUser from '../models/users.js';
import modelSopDetail from '../models/sop_details.js';
import modelSopImplementer from '../models/sop_step_implementer.js';
import modelSopDetailImplementer from '../models/sop_detail_implementer.js';

const getImplementer = async (req, res, next) => {
    try {
        const implementer = await modelSopImplementer.findAll({
            attributes: [
                ['id_sop_implementer', 'id'],
                ['implementer_name', 'name'],
                'description'
            ]
        });

        return res.status(200).json({
            message: 'sukses mendapat data',
            data: implementer,
        });

    } catch (error) {
        next(error);
    }
};

const addSopImplementer = async (req, res, next) => {
    try {
        const { id_sop_detail, id_sop_implementer } = req.body;

        const dataImplementer = await modelSopImplementer.findByPk(id_sop_implementer);
        const dataSopDetail = await modelSopDetail.findByPk(id_sop_detail);

        // TODO buat pengecekan terlebih dahulu apakah kombinasi dari kedua data  yang sama sudah ada atau belum, kalau sudah buat validasinya, karena kalau sekarang hanya tampil error duplikat
        if (!dataImplementer || !dataSopDetail) {
            const error = new Error('Data pelaksana atau sop detail tidak ditemukan');
            error.status = 404;
            throw error;
        };

        await modelSopDetailImplementer.create({
            id_sop_detail, id_sop_implementer
        });

        return res.status(201).json({
            message: 'sukses menambahkan data',
        });
    } catch (error) {
        next(error);
    }
};

const getSopImplementer = async (req, res, next) => {
    try {
        const { id } = req.query;

        const dataSopDetail = await modelSopDetail.findByPk(id);
        if (!dataSopDetail) {
            const error = new Error('Data pelaksana atau sop detail tidak ditemukan');
            error.status = 404;
            throw error;
        };

        const dataSopImplementer = await modelSopImplementer.findAll({
            include: {
                model: modelSopDetail,
                where: { id_sop_detail: id },
                attributes: []
            },
            attributes: [
                ['id_sop_implementer', 'id'],
                ['implementer_name', 'name'],
            ]
        });

        return res.status(200).json({
            message: 'sukses mengambil data',
            data: dataSopImplementer,
        });

    } catch (error) {
        next(error);
    }
};

export { getImplementer, addSopImplementer, getSopImplementer };
