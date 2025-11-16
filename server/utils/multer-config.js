const multer = require('multer')
const path = require('path')

// 1. Define storage settings
const storage = multer.diskStorage({
  // Set the destination folder for uploads
  destination(req, file, cb) {
    cb(null, 'uploads/') // 'uploads' folder will be created in /server
  },
  // Set the filename
  filename(req, file, cb) {
    // file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  },
})

// 2. Define file filter (only allow images)
function checkFileType(file, cb) {
  const filetypes = /jpe?g|png|webp/ // Allowed file types
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true) // Accept the file
  } else {
    cb('Images only!') // Reject the file
  }
}

// 3. Configure the upload middleware
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  },
})

module.exports = { upload, checkFileType }