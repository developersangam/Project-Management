const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orgController');

router.post('/', ctrl.createOrg);
router.get('/', ctrl.listOrgs);
router.get('/:id', ctrl.getOrg);
router.put('/:id', ctrl.updateOrg);
router.delete('/:id', ctrl.deleteOrg);

module.exports = router;
