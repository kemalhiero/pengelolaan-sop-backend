import modelUser from '../models/users.js';
import modelRole from '../models/roles.js';

const regisUser = async (req, res) => {
    try {
        const {} = req.body;



        res.status(200).json({
            message: 'sukses regis user'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const {} = req.body;



        res.status(200).json({
            message: 'sukses login'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getPic = async (req, res) => {
    try {
        const pic = await modelUser.findAll({
            attributes: ['id_user', 'identitiy_number', 'name'],
            include: {
                model: modelRole,
                where: { role_name: 'pj' }
            }
        })

        res.status(200).json({
            message: 'sukses login',
            data: pic
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
        });
    }
};



export { regisUser, loginUser };
