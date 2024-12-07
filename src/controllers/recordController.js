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

export { addRecord };
