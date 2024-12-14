import modelLegal from '../models/legal_basis.js';
import modelLawType from '../models/law_types.js';
import modelSopDetail from '../models/sop_details.js';
import modelLegalBasisSopDetail from '../models/legal_basis_sop_details.js';

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
            include: {
                model: modelLawType,
                attributes: ['id_law_type', 'law_type'],
            }
        });

        // Flatten the response so that law_type is not nested
        const flattenedLegal = legal.map(item => ({
            id: item.id_legal,
            number: item.number,
            year: item.year,
            about: item.about,
            id_law_type: item.law_type.id_law_type,  // Flatten law_type
            law_type: item.law_type.law_type,  // Flatten law_type
        }));

        return res.status(200).json({
            message: 'sukses mendapat data',
            data: flattenedLegal,
        });

    } catch (error) {
        next(error);
    }
};

const deleteLegal = async (req, res) => {
    try {
        const { id } = req.query;
        const legal = await modelLegal.findByPk(id, { attributes: ['id_legal'] });

        if (!legal) return res.status(404).json({ message: 'data tidak ditemukan' });

        await legal.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
};

const updateLegal = async (req, res) => {
    try {
        const { id } = req.query;
        const { id_law_type, number, year, about } = req.body;
        const legal = await modelLegal.findByPk(id, { attributes: ['id_legal'] });

        if (!legal) return res.status(404).json({ message: 'data tidak ditemukan' });

        await legal.update({
            id_law_type, number, year, about
        });

        return res.status(200).json({
            message: 'sukses memperbarui data',
        });

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
            const error = new Error('Data dasar hukum atau sop detail tidak ditemukan');
            error.status = 404;
            throw error;
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
        const { id } = req.query;

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
        const { id_sop_detail, id_legal } = req.query;

        if (isNaN(Number(id_sop_detail)) || isNaN(Number(id_legal))) {
            const error = new Error('ID harus berupa angka');
            error.status = 400;
            throw error;
        };

        const dataSopLegal = await modelLegalBasisSopDetail.findOne({
            where: {
                id_sop_detail, id_legal
            }
        });
        if (!dataSopLegal) {
            const error = new Error('Data dasar hukum sop tidak ditemukan!');
            error.status = 404;
            throw error;
        };

        await dataSopLegal.destroy();

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
}
