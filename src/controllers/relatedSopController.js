import modelRelatedSop from '../models/relation_other_sop.js';
import { validateText, validateUUID } from '../utils/validation.js';

const addRelatedSop = async (req, res, next) => {
    try {
        const { id_sop_detail, related_sop } = req.body;

        if (!related_sop || !id_sop_detail) {
            console.error('id POS detail harus berupa uuid dan ID related POS harus berupa angka')
            return res.status(400).json({ message: 'id POS detail harus berupa uuid dan ID related POS harus berupa angka' })
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
    const { id } = req.params;
    if (!validateUUID(id)) {
        console.error('ID harus berupa UUID')
        return res.status(400).json({ message: 'ID harus berupa UUID' })
    }

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
        const { id } = req.params;
        if (!validateUUID(id)) {
            console.error('ID harus berupa UUID')
            return res.status(400).json({ message: 'ID harus berupa UUID' })
        }

        const deletedCount = await modelRelatedSop.destroy({ where: { id_relation_sop: id } });
        if (deletedCount === 0) {
            console.error('Data POS terkait tidak ditemukan!')
            return res.status(404).json({ message: 'Data POS terkait tidak ditemukan!' })
        };

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

export { addRelatedSop, getRelatedSop, deleteRelatedSop };
