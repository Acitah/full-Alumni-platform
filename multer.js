const multer = require('multer');
const { CloudinaryDtorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloud');

const storage = new CloudinaryDtorage({
    cloudinary: cloudinary,
    params: {
        folder: 'alumni-profile-pictures',
        allowed_formats: ['jpg', 'jpeg', 'png'],
        transsformation: [{ width: 
            300, height: 300, crop: 'fill' }]

    }
});

const upload = multer({ storage });
module.exports = upload;