const router = require('express').Router();
const legalController = require('../controllers/legalBasisController')

router.route('/')
    .get(legalController.getLegal)
    .post(legalController.addLegal)
    .patch(legalController.updateLegal)
    .delete(legalController.deleteLegal)

module.exports = router;