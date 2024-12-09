import modelEquipment from '../models/equipment.js';
import { validateText } from '../utils/validation.js';

const addEquipment = async (req, res, next) => {
    try {
        const { id_sop_detail, equipment } = req.body;

        if (!equipment) {
            const error = new Error('Data peralatan tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        if (!validateText(equipment)) {
            const error = new Error('Tidak boleh diawali dengan angka atau simbol');
            error.status = 400; // Bad Request
            throw error;
        };

        await modelEquipment.create({
            id_sop_detail, equipment
        });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

const getSopEquipment = async (req, res, next) => {
    try {
        const { id } = req.query;

        const dataPeralatanSop = await modelEquipment.findAll({
            where: {
                id_sop_detail: id
            },
            attributes: [
                ['id_equipment', 'id'],
                'equipment'
            ]
        });
    
        if (dataPeralatanSop.length == 0) {
            const error = new Error('Data sop terkait tidak ditemukan!');
            error.status = 404;
            throw error;
        };
    
        res.status(200).json({
            message: 'sukses mengambil data',
            data: dataPeralatanSop
        }); 
    } catch (error) {
        next(error);
    }
};

export { addEquipment, getSopEquipment };
