import modelRelatedSop from '../models/relation_other_sop.js';
import { validateText } from '../utils/validation.js';

const addRelatedSop = async (req, res, next) => {
    try {
        const { id_sop_detail, related_sop } = req.body;

        if (!related_sop || !id_sop_detail) {
            const error = new Error('Data sop yang berelasi tidak ada!');
            error.status = 404;
            throw error;
        };

        if (!validateText(related_sop)) {
            const error = new Error('Tidak boleh diawali dengan angka atau simbol');
            error.status = 400;
            throw error;
        };

        await modelRelatedSop.create({
            id_sop_detail, related_sop
        });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });

    } catch (error) {
        next(error);
    }
};

const getRelatedSop = async (req, res, next) => {
    const { id } = req.query;

    const dataSopTerkait = await modelRelatedSop.findAll({
        where: {
            id_sop_detail: id
        },
        attributes: [
            ['id_relation_sop', 'id'],
            'related_sop'
        ]
    });

    if (dataSopTerkait.length == 0) {
        const error = new Error('Data sop terkait tidak ditemukan!');
        error.status = 404;
        throw error;
    };

    res.status(200).json({
        message: 'sukses mengambil data',
        data: dataSopTerkait
    });
};

const deleteRelatedSop = async (req, res, next) => {
    try {
        const { id } = req.query;

        if (isNaN(Number(id))) {
            const error = new Error('ID harus berupa angka');
            error.status = 400;
            throw error;
        };

        const dataRelatedSop = await modelRelatedSop.findByPk(id, { attributes: ['id_relation_sop'] });
        if (!dataRelatedSop) {
            const error = new Error('Data sop terkait tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        await dataRelatedSop.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

export { addRelatedSop, getRelatedSop, deleteRelatedSop };
