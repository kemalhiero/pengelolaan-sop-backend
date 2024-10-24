const modelLawType = require('../models/law_types');

const addLawType = async (req, res) => {
    try {

        const { lawType, description } = req.body;

        await modelLawType.create({
            law_type: lawType,
            description
        })

        res.status(200).json({
            message: 'success create data'
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
}

const getLawType = async (req, res) => {
    try {
        const lawType = await modelLawType.findAll();

        return res.status(200).json({
            message: 'sukes mendapat data',
            data: lawType,
        });

    } catch (error) {
        console.error(err);
        return res.status(500).json({
            message: err.message,
        });
    }
}

module.exports = {
    addLawType, getLawType
}