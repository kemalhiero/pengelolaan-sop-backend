import modelSopDetail from '../models/sop_details.js';
import modelImplementer from '../models/implementer.js';
import modelSopDetailImplementer from '../models/sop_detail_implementer.js';
import { validateUUID } from '../utils/validation.js';

const getImplementer = async (req, res, next) => {
    try {
        const implementer = await modelImplementer.findAll({
            attributes: [
                ['id_implementer', 'id'],
                'name', 'description'
            ],
            include: {
                model: modelSopDetail,
                attributes: [['id_sop', 'id']],
                group: 'id_sop',
                through: { attributes: [] }
            }
        });

        const data = implementer.map(item => ({
            id: item.dataValues.id,
            name: item.dataValues.name,
            description: item.dataValues.description,
            sop_total: item.dataValues.sop_details.length
        }))

        return res.status(200).json({
            message: 'sukses mendapat data!',
            data
        });
    } catch (error) {
        next(error);
    }
};

const addImplementer = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) return res.status(404).json({ message: 'pastikan data tidak kosong!' });

        await modelImplementer.create({ name, description });

        return res.status(200).json({
            message: 'sukses menambahkan data!',
        });
    } catch (error) {
        next(error);
    }
};

const updateImplementer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const implementer = await modelImplementer.findByPk(id);
        if (!implementer) return res.status(404).json({ message: 'data tidak ditemukan!' });

        await implementer.update({ name, description });

        return res.status(200).json({
            message: 'sukses memperbarui data!',
        });
    } catch (error) {
        next(error);
    }
};

const deleteImplementer = async (req, res, next) => {
    try {
        const { id } = req.params;

        const implementer = await modelImplementer.findByPk(id);
        if (!implementer) return res.status(404).json({ message: 'data tidak ditemukan!' });

        await implementer.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data!',
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
        const { id } = req.params;

        const dataSopDetail = await modelSopDetail.findByPk(id, { attributes: ['id_sop_detail'] });
        if (!dataSopDetail) {
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
                ['id_implementer', 'id'], 'name'
            ]
        });

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
        const { sopDetailId, implementerId } = req.params;
        if (!validateUUID(sopDetailId) || isNaN(Number(implementerId))) {
            console.error('idsopdetail harus berupa UUID dan id implementer harus berupa angka')
            return res.status(400).json({ message: 'idsopdetail harus berupa UUID dan id implementer harus berupa angka' })
        };

        const dataSopDetail = await modelSopDetailImplementer.findOne({
            where: {
                id_sop_detail: sopDetailId,
                id_implementer: implementerId
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

export {
    getImplementer, addImplementer, updateImplementer, deleteImplementer,
    addSopImplementer, getSopImplementer, deleteSopImplementer
};
