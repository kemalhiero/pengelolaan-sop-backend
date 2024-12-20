import modelUser from '../models/users.js';
import modelRole from '../models/roles.js';

const regisUser = async (req, res, next) => {
    try {
        const {} = req.body;

        res.status(200).json({
            message: 'sukses regis user'
        });

    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const {} = req.body;



        res.status(200).json({
            message: 'sukses login'
        });

    } catch (error) {
        next(error);
    }
};

const getDrafter = async (req, res, next) => {
    try {
        const pic = await modelUser.findAll({
            attributes: ['id_user', 'identity_number', 'name'],
            include: {
                model: modelRole,
                attributes: ['role_name'],
                // where: { role_name: 'pj' }
            }
        });

        const data = pic.map(item => ({
            id: item.id_user,
            identity_number: item.identity_number,
            name: item.name,
            role: item.role.role_name
        }));

        res.status(200).json({
            message: 'sukses mendapatkan data',
            data
        });

    } catch (error) {
        next(error);
    }
};

export { regisUser, loginUser, getDrafter };
