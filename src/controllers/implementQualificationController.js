import modelImplementQualificationCOntroller from '../models/implement_qualification.js';
import { validateText } from '../utils/validation.js';

const addSopIQ = async (req, res, next) => {
    try {
        const { id_sop_detail, qualification } = req.body;

        if (!qualification) {
            console.error('Data kualifikasi pelaksana tidak ditemukan!')
            return res.status(404).json({ message: 'Data kualifikasi pelaksana tidak ditemukan!' })
        };

        if (!validateText(qualification)) {
            console.error('Tidak boleh diawali dengan angka atau simbol')
            return res.status(400).json({ message: 'Tidak boleh diawali dengan angka atau simbol' })
        };

        await modelImplementQualificationCOntroller.create({
            id_sop_detail, qualification
        });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });
    } catch (error) {
        next(error);
    }
};

const getSopIQ = async (req, res, next) => {
    try {
        const { id } = req.params;

        const dataSopIq = await modelImplementQualificationCOntroller.findAll({
            where: {
                id_sop_detail: id
            },
            attributes: [
                ['id_qualification', 'id'],
                'qualification'
            ]
        });

        res.status(200).json({
            message: 'sukses mengambil data',
            data: dataSopIq
        });
    } catch (error) {
        next(error);
    }
};

const deleteSopIQ = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            console.error('ID harus berupa angka')
            return res.status(400).json({ message: 'ID harus berupa angka' })
        };

        const deletedCount = await modelImplementQualificationCOntroller.destroy({ where: { id_qualification: id } });
        if (deletedCount === 0) {
            console.error('Data tidak ditemukan')
            return res.status(404).json({ message: 'Data tidak ditemukan' })
        }

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

export { addSopIQ, getSopIQ, deleteSopIQ };
