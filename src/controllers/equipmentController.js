import modelEquipment from '../models/equipment.js';
import { validateText } from '../utils/validation.js';

const addEquipment = async (req, res, next) => {
    try {
        const { id_sop_detail, equipment } = req.body;

        if (!equipment) {
            console.error('Data peralatan tidak ditemukan!')
            return res.status(404).json({ message: 'Data peralatan tidak ditemukan!' })
        };

        if (!validateText(equipment)) {
            console.error('Tidak boleh diawali dengan angka atau simbol!')
            return res.status(400).json({ message: 'Tidak boleh diawali dengan angka atau simbol!' })
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
        const { id } = req.params;
        if (!id) {
            console.error('Masukkan ID terlebih dahulu!')
            return res.status(400).json({ message: 'Masukkan ID terlebih dahulu!' })
        };

        const dataPeralatanSop = await modelEquipment.findAll({
            where: {
                id_sop_detail: id
            },
            attributes: [
                ['id_equipment', 'id'],
                'equipment'
            ]
        });

        res.status(200).json({
            message: 'sukses mengambil data',
            data: dataPeralatanSop
        });

    } catch (error) {
        next(error);
    }
};

const deleteEquipment = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            console.error('ID harus berupa angka!')
            return res.status(400).json({ message: 'ID harus berupa angka!' })
        };

        const dataEquipment = await modelEquipment.findByPk(id, { attributes: ['id_equipment'] });
        if (!dataEquipment) {
            console.error('Data peralatan tidak ditemukan!')
            return res.status(404).json({ message: 'Data peralatan tidak ditemukan!' })
        };

        await dataEquipment.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

export { addEquipment, getSopEquipment, deleteEquipment };
