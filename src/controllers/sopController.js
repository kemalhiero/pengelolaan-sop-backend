import modelSop from '../models/sop.js';

const addSop = async (req, res) => {
    try {
        const { id_org, name } = req.body;

        const data = await modelSop.create({
            id_org, name, is_active : false
        });

        return res.status(200).json({
            data,
            message: 'sukses menambahkan data'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

export {addSop};
