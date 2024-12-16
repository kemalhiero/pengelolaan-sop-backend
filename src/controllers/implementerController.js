import modelUser from '../models/users.js';
import modelSopDetail from '../models/sop_details.js';
import modelImplementer from '../models/implementer.js';
import modelSopDetailImplementer from '../models/sop_detail_implementer.js';

const getImplementer = async (req, res, next) => {
    try {
        const implementer = await modelImplementer.findAll({
            attributes: [
                ['id_implementer', 'id'],
                ['implementer_name', 'name'],
                'description'
            ]
        });

        return res.status(200).json({
            message: 'sukses mendapat data',
            data: implementer,
        });

    } catch (error) {
        next(error);
    }
};

const addSopImplementer = async (req, res, next) => {
    try {
        const { id_sop_detail, id_implementer } = req.body;

        const dataImplementer = await modelImplementer.findByPk(id_implementer, { attributes: ['id_implementer'] });
        const dataSopDetail = await modelSopDetail.findByPk(id_sop_detail, { attributes: ['id_sop_detail'] });

        // TODO buat pengecekan terlebih dahulu apakah kombinasi dari kedua data  yang sama sudah ada atau belum, kalau sudah buat validasinya, karena kalau sekarang hanya tampil error duplikat
        if (!dataImplementer || !dataSopDetail) {
            console.error('Data pelaksana atau sop detail tidak ditemukan')
            return res.status(404).json({ message: 'Data pelaksana atau sop detail tidak ditemukan' })
        };

        await modelSopDetailImplementer.create({
            id_sop_detail, id_implementer
        });

        return res.status(201).json({
            message: 'sukses menambahkan data',
        });
    } catch (error) {
        next(error);
    }
};

const getSopImplementer = async (req, res, next) => {
    try {
        const { id } = req.query;

        const dataSopDetail = await modelSopDetail.findByPk(id, { attributes: ['id_sop_detail'] });
        if (!dataSopDetail) {
            const error = new Error('');
            console.error('Data pelaksana atau sop detail tidak ditemukan!')
            return res.status(400).json({ message: 'Data pelaksana atau sop detail tidak ditemukan!' })
        };

        const dataSopImplementer = await modelImplementer.findAll({
            include: {
                model: modelSopDetail,
                where: { id_sop_detail: id },
                attributes: []
            },
            attributes: [
                ['id_implementer', 'id'],
                ['implementer_name', 'name'],
            ]
        });
        if (dataSopImplementer.length == 0) {
            console.error('Data pelaksana tidak ditemukan!')
            return res.status(404).json({ message: 'Data pelaksana tidak ditemukan!' })
        };
        
        return res.status(200).json({
            message: 'sukses mengambil data',
            data: dataSopImplementer,
        });

    } catch (error) {
        next(error);
    }
};

const deleteSopImplementer = async (req, res, next) => {
    try {
        const { id_sop_detail, id_implementer } = req.query;

        if (isNaN(Number(id_sop_detail)) || isNaN(Number(id_implementer))) {
            console.error('ID harus berupa angka')
            return res.status(400).json({ message: 'ID harus berupa angka' })
        };

        const dataSopDetail = await modelSopDetailImplementer.findOne({
            where: {
                id_sop_detail,
                id_implementer
            }
        });
        if (!dataSopDetail) {
            console.error('Data pelaksana sop tidak ditemukan!')
            return res.status(404).json({ message: 'Data pelaksana sop tidak ditemukan!' })
        };

        await dataSopDetail.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data',
        });
    } catch (error) {
        next(error);
    }
};

export { getImplementer, addSopImplementer, getSopImplementer, deleteSopImplementer };
