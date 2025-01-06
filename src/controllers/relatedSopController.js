import modelRelatedSop from '../models/relation_other_sop.js';
import { validateText } from '../utils/validation.js';

const addRelatedSop = async (req, res, next) => {
    try {
        const { id_sop_detail, related_sop } = req.body;

        if (!related_sop || !id_sop_detail) {
            console.error('ID harus berupa angka')
            return res.status(400).json({ message: 'ID harus berupa angka' })
        };

        if (!validateText(related_sop)) {
            console.error('Tidak boleh diawali dengan angka atau simbol!')
            return res.status(400).json({ message: 'Tidak boleh diawali dengan angka atau simbol!' })
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

    res.status(200).json({
        message: 'sukses mengambil data',
        data: dataSopTerkait
    });
};

const deleteRelatedSop = async (req, res, next) => {
    try {
        const { id } = req.query;

        if (isNaN(Number(id))) {
            console.error('ID harus berupa angka')
            return res.status(400).json({ message: 'ID harus berupa angka' })
        };

        const dataRelatedSop = await modelRelatedSop.findByPk(id, { attributes: ['id_relation_sop'] });
        if (!dataRelatedSop) {
            console.error('Data sop terkait tidak ditemukan!')
            return res.status(404).json({ message: 'Data sop terkait tidak ditemukan!' })
        }

        await dataRelatedSop.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

export { addRelatedSop, getRelatedSop, deleteRelatedSop };
