const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'drayatc08',
  api_key: '749174413396642',
  api_secret: 'YjEefQR5wvwEf1uP1D3euvsHY5g'
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'products'
  }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;




