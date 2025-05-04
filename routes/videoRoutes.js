// routes/videoRoutes.js
const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

const multer = require('multer');
const path = require('path');
const upload = multer({
  dest: path.join(__dirname, '../resources/uploads/')
});

router.post('/upload', upload.single('videoFile'), videoController.postNewVideo);


router.get('/new_video', videoController.getNewVideo);
router.post('/new', videoController.postNewVideo);
router.get('/dashboard/:videofilter', videoController.getDashboard);

module.exports = router;
