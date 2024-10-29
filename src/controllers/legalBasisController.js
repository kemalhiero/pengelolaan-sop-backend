import modelLegal from '../models/legal_basis.js';
import modelLawType from '../models/law_types.js';

const addLegal = async (req, res) => {
    try {
        const {id_law_type, number, year, about} = req.body;

        await modelLegal.create({
            id_law_type, number, year, about
        })

        res.status(200).json({
            message: 'sukses menambahkan data'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
}

const getLegal = async (req, res) => {
    try {
        const legal = await modelLegal.findAll({
            attributes: ['id_legal', 'number', 'year', 'about'],
            include: {
                model: modelLawType,
                attributes: ['law_type'],
            }
        });

        // Flatten the response so that law_type is not nested
        const flattenedLegal = legal.map(item => ({
            id_legal: item.id_legal,
            number: item.number,
            year: item.year,
            about: item.about,
            law_type: item.law_type.law_type,  // Flatten law_type
        }));

        return res.status(200).json({
            message: 'sukes mendapat data',
            data: flattenedLegal,
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
}

const deleteLegal = async (req, res) => {
    try {
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
}

const updateLegal = async (req, res) => {
    try {
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
}

export {
    addLegal, getLegal, deleteLegal, updateLegal
}
