const router = require('express').Router();
const lawTypeController = require('../controllers/lawTypeController');

router.route('/')
    .get(lawTypeController.getLawType)
    .post(lawTypeController.addLawType)

module.exports = router;
