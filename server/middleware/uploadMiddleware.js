// Multer configuration for handling image uploads
// Same logic as the previous multer-config.js in the utils folder but placed in middleware folder so it can be used as middleware
//not using multer-config.js anymore but will still keep it for reference

const multer = require('multer')
const path = require('path')                                                     // Node.js module for working with file paths

// 1. Define storage settings
const storage = multer.diskStorage({
  destination(req, file, cb) {                                                   // Define the destination folder for uploads (The 'uploads' folder should be at the root of your project)
    cb(null, 'uploads/')                                                         // cb(error, destination_path) 
  },
  filename(req, file, cb) {                                                     // Define the filename format
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`        // Example: product-123-20250101.jpg
    )
  },
})
// 2. Define file filter (only allow images)
function checkFileType(file, cb) {
  const filetypes = /jpe?g|png/                                                  // Regex to check extensions (jpg, jpeg, png)
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())  // Check file extension
  const mimetype = filetypes.test(file.mimetype)                                 // Check mime type

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Only images (JPEG, JPG, PNG) allowed!')
  }
}
// 3. Export the configured multer instance
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

module.exports = { upload, checkFileType }