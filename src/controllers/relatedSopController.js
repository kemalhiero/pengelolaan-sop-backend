import modelRelatedSop from '../models/relation_other_sop.js';
import { validateText } from '../utils/validation.js';

const addRelatedSop = async (req, res, next) => {
    try {
        const relatedSop = req.body;

        if (!relatedSop) {
            const error = new Error('Data sop tidak ada!');
            error.status = 404;
            throw error;
        };

        if (!validateText(iq)) {
            const error = new Error('Tidak boleh diawali dengan angka atau simbol');
            error.status = 400;
            throw error;
        };

        await modelRelatedSop.create({ relatedSop });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });

    } catch (error) {
        next(error);
    }
};

export { addRelatedSop };
