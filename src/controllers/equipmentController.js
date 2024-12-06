import modelEquipment from '../models/equipment.js';
import { validateText } from '../utils/validation.js';

const addEquipment = async (req, res, next) => {
    try {
        const equipment = req.body;

        if (!equipment) {
            const error = new Error('Data pelaksana tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        if (!validateText(equipment)) {
            const error = new Error('Tidak boleh diawali dengan angka atau simbol');
            error.status = 400; // Bad Request
            throw error;
        };

        await modelEquipment.create({ equipment });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

export { addEquipment };
