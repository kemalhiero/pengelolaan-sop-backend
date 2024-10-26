const router = require('express').Router();
const lawTypeController = require('../controllers/lawTypeController');

router.route('/')
    .get(lawTypeController.getLawType)
    .post(lawTypeController.addLawType)
    .delete(lawTypeController.deleteLawType)
    .patch(lawTypeController.updateLawType)

module.exports = router;
