const modelLawType = require('../models/law_types');

const addLawType = async (req, res) => {
    try {

        const { law_type, description } = req.body;

        await modelLawType.create({
            law_type,
            description
        })

        res.status(200).json({
            message: 'success menambahkan data'
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
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
}

const deleteLawType = async (req, res) => {
    try {
        const {id} = req.query;
        const lawType = await modelLawType.findByPk(id);

        if (!lawType) {
            return res.status(404).json({message : 'data tidak ditemukan'})
        }

        await lawType.destroy();

        return res.status(200).json({
            message: 'sukes menghapus data',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
}

const updateLawType = async (req, res) => {
    try {
        const {id} = req.query;
        const {law_type, description} = req.body;
        const lawType = await modelLawType.findByPk(id);

        if (!lawType) return res.status(404).json({message : 'data tidak ditemukan'})

        await lawType.update(
            { law_type, description }
        );

        return res.status(200).json({
            message: 'sukes memperbarui data',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
}

module.exports = {
    addLawType, getLawType, deleteLawType, updateLawType
}