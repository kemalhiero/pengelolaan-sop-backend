import modelLegal from '../models/legal_basis.js';
import modelLawType from '../models/law_types.js';

const addLegal = async (req, res, next) => {
    try {
        const {id_law_type, number, year, about} = req.body;

        await modelLegal.create({
            id_law_type, number, year, about
        });

        res.status(200).json({
            message: 'sukses menambahkan data'
        });

    } catch (error) {
        next(error);
    }
}

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
            message: 'sukes mendapat data',
            data: flattenedLegal,
        });
        
    } catch (error) {
        next(error);
    }
}

const deleteLegal = async (req, res) => {
    try {
        const {id} = req.query;
        const legal = await modelLegal.findByPk(id);

        if (!legal) return res.status(404).json({message: 'data tidak ditemukan'});

        await legal.destroy();

        return res.status(200).json({
            message: 'sukes menghapus data',
        });

    } catch (error) {
        next(error);
    }
}

const updateLegal = async (req, res) => {
    try {
        const {id} = req.query;
        const {id_law_type, number, year, about} = req.body;
        const legal = await modelLegal.findByPk(id);

        if (!legal) return res.status(404).json({message: 'data tidak ditemukan'});

        await legal.update({
            id_law_type, number, year, about
        })

        return res.status(200).json({
            message: 'sukes memperbarui data',
        });
        
    } catch (error) {
        next(error);
    }
}

export {
    addLegal, getLegal, deleteLegal, updateLegal
}
