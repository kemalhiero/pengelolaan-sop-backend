const modelLegal = require('../models/legal_basis');
const modelLawType = require('../models/law_types');

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
            include: modelLawType
        });

        return res.status(200).json({
            message: 'sukes mendapat data',
            data: legal,
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

module.exports = {
    addLegal, getLegal, deleteLegal, updateLegal
}