import modelRecord from '../models/data_record.js';
import { validateText } from '../utils/validation.js';

const addRecord = async (req, res, next) => {
    try {
        const { id_sop_detail, data_record } = req.body;

        if (!data_record) {
            const error = new Error('Data pencatatan tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        if (!validateText(data_record)) {
            const error = new Error('Tidak boleh diawali dengan angka atau simbol');
            error.status = 400;
            throw error;
        };

        await modelRecord.create({
            id_sop_detail, data_record
        });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });

    } catch (error) {
        next(error);
    }
};

const getSopRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: 'Masukkan ID terlebih dahulu!' });

        const dataPencatatanSop = await modelRecord.findAll({
            where: {
                id_sop_detail: id
            },
            attributes: [
                ['id_data_record', 'id'],
                'data_record'
            ]
        });

        res.status(200).json({
            message: 'sukses mengambil data',
            data: dataPencatatanSop
        });

    } catch (error) {
        next(error);
    }
};

const deleteSopRecord = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            console.error('ID harus berupa angka')
            return res.status(400).json({ message: 'ID harus berupa angka' })
        };

        const deletedCount = await modelRecord.destroy({ where: { id_data_record: id } });
        if (deletedCount === 0) {
            console.error('Data pencatatan sop tidak ditemukan!')
            return res.status(404).json({ message: 'Data pencatatan sop tidak ditemukan!' })
        };

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

export { addRecord, getSopRecord, deleteSopRecord };
