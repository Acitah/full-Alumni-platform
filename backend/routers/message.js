const express = require('express');
const auth = require('../middlewares/auth');

const {  sendMessage, getMessage, patchMessage, deleteMessage
 } = require('../controllers/message');

const router = express.Router();

router.post('/', sendMessage);
router.get('/:id', getMessage);
router.patch('/:messageId', auth, patchMessage);
router.delete('/:messageId', deleteMessage);

module.exports = router;