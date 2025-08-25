import modelLegal from '../models/legal_basis.js';
import modelLawType from '../models/law_types.js';
import modelSopDetail from '../models/sop_details.js';
import modelLegalBasisSopDetail from '../models/legal_basis_sop_details.js';
import { validateUUID } from '../utils/validation.js';

const addLegal = async (req, res, next) => {
    try {
        const { id_law_type, number, year, about } = req.body;

        await modelLegal.create({
            id_law_type, number, year, about
        });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });

    } catch (error) {
        next(error);
    }
};

const getLegal = async (req, res, next) => {
    try {
        const legal = await modelLegal.findAll({
            attributes: ['id_legal', 'number', 'year', 'about'],
            include: [
                {
                    model: modelLawType,
                    attributes: ['id_law_type', 'law_type'],
                },
                {
                    model: modelSopDetail,
                    attributes: [['id_sop', 'id']],
                    group: 'id_sop',
                    through: { attributes: [] }
                }
            ]
        });

        // Flatten the response so that law_type is not nested
        const data = legal.map(item => ({
            id: item.id_legal,
            number: item.number,
            year: item.year,
            about: item.about,
            id_law_type: item.law_type.id_law_type,  // Flatten law_type
            law_type: item.law_type.law_type,  // Flatten law_type
            sop_total: item.sop_details.length
        }));

        return res.status(200).json({
            message: 'sukses mendapat data',
            data
        });

    } catch (error) {
        next(error);
    }
};

const deleteLegal = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) return res.status(400).json({ message: 'ID harus berupa angka' });

        const deletedCount = await modelLegal.destroy({ where: { id_legal: id } });
        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Data user atau POS tidak ditemukan' });
        }

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

const updateLegal = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id_law_type, number, year, about } = req.body;

        if (isNaN(Number(id))) return res.status(400).json({ message: 'ID harus berupa angka' });

        const [updated] = await modelLegal.update({ id_law_type, number, year, about }, {
            where: { id_legal: id }
        });

        if (!updated) return res.status(404).json({ message: 'Data tidak ditemukan' });

        return res.status(200).json({ message: 'Sukses memperbarui data' });

    } catch (error) {
        next(error);
    }
};

const addSopLegal = async (req, res, next) => {
    try {
        const { id_sop_detail, id_legal } = req.body;

        const sopDetail = await modelSopDetail.findByPk(id_sop_detail, { attributes: ['id_sop_detail'] });
        const legal = await modelLegal.findByPk(id_legal, { attributes: ['id_legal'] });

        if (!sopDetail || !legal) {
            console.error('Data dasar hukum atau POS detail tidak ditemukan')
            return res.status(400).json({ message: 'Data dasar hukum atau POS detail tidak ditemukan' })
        };

        await modelLegalBasisSopDetail.create({
            id_sop_detail, id_legal
        });

        return res.status(200).json({
            message: 'sukses menambahkan data',
        });

    } catch (error) {
        next(error);
    }
};

const getSopLegal = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!validateUUID(id)) {
            console.error('ID harus berupa UUID')
            return res.status(400).json({ message: 'ID harus berupa UUID' })
        }

        const dataLegal = await modelLegal.findAll({
            attributes: ['id_legal', 'number', 'year', 'about'],
            include: [
                {
                    model: modelLawType,
                    attributes: ['id_law_type', 'law_type'],
                },
                {
                    model: modelSopDetail,
                    where: { id_sop_detail: id },
                    attributes: []
                }

            ]
        });

        const flattenedLegal = dataLegal.map(item => ({
            id: item.id_legal,
            number: item.number,
            year: item.year,
            about: item.about,
            id_law_type: item.law_type.id_law_type,  // Flatten law_type
            law_type: item.law_type.law_type,  // Flatten law_type
        }));

        return res.status(200).json({
            message: 'sukses mendapat data',
            data: flattenedLegal
        });

    } catch (error) {
        next(error);
    }
};

const deleteSopLegal = async (req, res, next) => {
    try {
        const { sopDetailId, legalId } = req.params;
        if (!validateUUID(sopDetailId) || isNaN(Number(legalId))) {
            console.error('ID sopDetail harus berupa UUID dan legalId harus berupa angka');
            return res.status(400).json({ message: 'ID sopDetail harus berupa UUID dan legalId harus berupa angka' });
        }

        const deletedCount = await modelLegalBasisSopDetail.destroy({
            where: {
                id_sop_detail: sopDetailId,
                id_legal: legalId
            }
        });
        if (!deletedCount) {
            console.error('Data dasar hukum POS tidak ditemukan!')
            return res.status(404).json({ message: 'Data dasar hukum POS tidak ditemukan!' })
        };

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

export {
    addLegal, getLegal, deleteLegal, updateLegal,
    addSopLegal, getSopLegal, deleteSopLegal
};
