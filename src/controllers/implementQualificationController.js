import modelImplementQualificationCOntroller from '../models/implement_qualification.js';
import { validateText } from '../utils/validation.js';

const addSopIQ = async (req, res, next) => {
    try {
        const { id_sop_detail, qualification } = req.body;

        if (!qualification) {
            const error = new Error('Data kualifikasi pelaksana tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        if (!validateText(qualification)) {
            const error = new Error('Tidak boleh diawali dengan angka atau simbol');
            error.status = 400; // Bad Request
            throw error;
        };

        await modelImplementQualificationCOntroller.create({
            id_sop_detail, qualification
        });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

const getSopIQ = async (req, res, next) => {
    try {
        const { id } = req.query;

        const dataSopIq = await modelImplementQualificationCOntroller.findAll({
            where: {
                id_sop_detail: id
            },
            attributes: [
                ['id_qualification', 'id'],
                'qualification'
            ]
        });

        if (dataSopIq.length == 0) {
            const error = new Error('Data kualifikasi pelaksana tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        res.status(200).json({
            message: 'sukses mengambil data',
            data: dataSopIq
        });
    } catch (error) {
        next(error);
    }
};

const deleteSopIQ = async (req, res, next) => {
    try {
        const { id } = req.query;

        if (isNaN(Number(id))) {
            const error = new Error('ID harus berupa angka');
            error.status = 400;
            throw error;
        };

        const dataIQ = await modelImplementQualificationCOntroller.findByPk(id, { attributes: ['id_qualification'] });
        if (!dataIQ) {
            const error = new Error('Data kualifikasi pelaksana tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        await dataIQ.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

export { addSopIQ, getSopIQ, deleteSopIQ };
