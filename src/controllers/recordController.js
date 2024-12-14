import modelRecord from '../models/data_record.js';
import { validateText } from '../utils/validation.js';

const addRecord = async (req, res, next) => {
    try {
        const { id_sop_detail, data_record } = req.body;

        // const sopDetail = await modelSopDetail.findByPk(id_sop_detail);

        if (!data_record) {
            const error = new Error('Data pencatatan tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        if (!validateText(data_record)) {
            const error = new Error('Tidak boleh diawali dengan angka atau simbol');
            error.status = 400;
            throw error;
        };

        await modelRecord.create({
            id_sop_detail, data_record
        });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

const getSopRecord = async (req, res, next) => {
    try {
        const { id } = req.query;

        const dataPencatatanSop = await modelRecord.findAll({
            where: {
                id_sop_detail: id
            },
            attributes: [
                ['id_data_record', 'id'],
                'data_record'
            ]
        });

        if (dataPencatatanSop.length == 0) {
            const error = new Error('Data pencatatan terkait tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        res.status(200).json({
            message: 'sukses mengambil data',
            data: dataPencatatanSop
        });
    } catch (error) {
        next(error);
    }
};

const deleteSopRecord = async (req, res, next) => {
    try {
        const { id } = req.query;

        if (isNaN(Number(id))) {
            const error = new Error('ID harus berupa angka');
            error.status = 400;
            throw error;
        };

        const dataSopRecord = await modelRecord.findByPk(id, { attributes: ['id_data_record'] });
        if (!dataSopRecord) {
            const error = new Error('Data pencatatan sop tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        await dataSopRecord.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

export { addRecord, getSopRecord, deleteSopRecord };
