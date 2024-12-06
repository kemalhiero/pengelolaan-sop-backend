import modelImplementQualificationCOntroller from '../models/implement_qualification.js';
import { validateText } from '../utils/validation.js';

const addImplementQualification = async (req, res, next) => {
    try {
        const iq = req.body;

        if (!iq) {
            const error = new Error('Data pelaksana tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        if (!validateText(iq)) {
            const error = new Error('Tidak boleh diawali dengan angka atau simbol');
            error.status = 400; // Bad Request
            throw error;
        };

        await modelImplementQualificationCOntroller.create({ iq });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

export { addImplementQualification };
