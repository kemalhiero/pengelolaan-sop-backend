import modelRecord from '../models/data_record.js';
import { validateText } from '../utils/validation.js';

const addRecord = async (req, res, next) => {
    try {
        const record = req.body;

        if (!record) {
            const error = new Error('Data pencatatan/pendataan tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        if (!validateText(record)) {
            const error = new Error('Tidak boleh diawali dengan angka atau simbol');
            error.status = 400;
            throw error;
        };

        await modelRecord.create({ record });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

export { addRecord };
