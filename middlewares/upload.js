// middlewares/upload.js

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Setup Cloudinary storage using Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecomplus',            // Folder in Cloudinary where images will be uploaded
    allowedFormats: ['jpeg', 'png', 'jpg']  // Accepted file formats
  }
});

// Set up multer with Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;
