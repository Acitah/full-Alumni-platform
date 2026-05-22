
const upload = require('../config/multer');

router.patch('/users/avatar', protect, upload.single('avatar'), uploadAvatar);