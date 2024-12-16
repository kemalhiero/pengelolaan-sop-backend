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
        const { id } = req.query;

        const dataSopIq = await modelImplementQualificationCOntroller.findAll({
            where: {
                id_sop_detail: id
            },
            attributes: [
                ['id_qualification', 'id'],
                'qualification'
            ]
        });

        if (dataSopIq.length == 0) {
            console.error('Data kualifikasi pelaksana tidak ditemukan!')
            return res.status(404).json({ message: 'Data kualifikasi pelaksana tidak ditemukan!' })
        };

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
        const { id } = req.query;

        if (isNaN(Number(id))) {
            console.error('ID harus berupa angka')
            return res.status(400).json({ message: 'ID harus berupa angka' })
        };

        const dataIQ = await modelImplementQualificationCOntroller.findByPk(id, { attributes: ['id_qualification'] });
        if (!dataIQ) {
            console.error('Data kualifikasi pelaksana tidak ditemukan!')
            return res.status(404).json({ message: 'Data kualifikasi pelaksana tidak ditemukan!' })
        };

        await dataIQ.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

export { addSopIQ, getSopIQ, deleteSopIQ };
