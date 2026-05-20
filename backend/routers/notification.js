const express = require('express');

const { getNotification, updateNotification, deleteNotification, } = require('../controllers/notification');

const router = express.Router();

router.get( '/', getNotification );
router.patch( '/:id', updateNotification );
router.delete( '/:id', deleteNotification );

module.exports = router;

