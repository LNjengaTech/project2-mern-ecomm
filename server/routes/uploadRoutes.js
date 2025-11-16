const express = require('express')
const router = express.Router()
const { upload } = require('../utils/multer-config') // Import Multer config
const { protect, admin } = require('../middleware/authMiddleware') // Protect route

// Single image upload handler
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (req.file) {
    // Send the file path back to the client
    res.send(`/${req.file.path}`) // e.g., /uploads/image-12345678.jpg
  } else {
    res.status(400)
    throw new Error('Image upload failed.')
  }
})

module.exports = router