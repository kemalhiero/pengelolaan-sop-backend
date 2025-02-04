import modelLawType from '../models/law_types.js';
import modelLegal from '../models/legal_basis.js';

const addLawType = async (req, res, next) => {
    try {

        const { law_type, description } = req.body;

        await modelLawType.create({
            law_type,
            description
        });

        res.status(201).json({
            message: 'sukses menambahkan data'
        });

    } catch (error) {
        next(error);
    }
}

const getLawType = async (req, res, next) => {
    try {
        const lawType = await modelLawType.findAll({
            attributes: [
                ['id_law_type', 'id'],
                'law_type', 'description'
            ],
            include: {
                model: modelLegal,
                attributes: [['id_legal', 'id']]
            }
        });

        const data = lawType.map(item => ({
            id: item.dataValues.id,
            law_type: item.dataValues.law_type,
            description: item.dataValues.description,
            law_total: item.legal_bases.length
        }));

        return res.status(200).json({
            message: 'sukses mendapat data',
            data
        });

    } catch (error) {
        next(error);
    }
}

const deleteLawType = async (req, res, next) => {
    try {
        const { id } = req.query;
        const lawType = await modelLawType.findByPk(id);

        if (!lawType) {
            return res.status(404).json({ message: 'data tidak ditemukan' })
        }

        await lawType.destroy();

        return res.status(200).json({
            message: 'sukses menghapus data',
        });

    } catch (error) {
        next(error);
    }
}

const updateLawType = async (req, res, next) => {
    try {
        const { id } = req.query;
        const { law_type, description } = req.body;
        const lawType = await modelLawType.findByPk(id);

        if (!lawType) return res.status(404).json({ message: 'data tidak ditemukan' })

        await lawType.update(
            { law_type, description }
        );

        return res.status(200).json({
            message: 'sukses memperbarui data',
        });

    } catch (error) {
        next(error);
    }
}

export {
    addLawType, getLawType, deleteLawType, updateLawType
}