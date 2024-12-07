import modelRelatedSop from '../models/relation_other_sop.js';
import { validateText } from '../utils/validation.js';

const addRelatedSop = async (req, res, next) => {
    try {
        const { id_sop_detail, related_sop } = req.body;

        if (!related_sop) {
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

export { addRelatedSop };
