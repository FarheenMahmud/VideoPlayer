const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/new_video', authMiddleware, videoController.getNewVideo);
router.post('/new', authMiddleware, videoController.postNewVideo);
router.get('/dashboard/:videofilter', authMiddleware, videoController.getDashboard);

module.exports = router;
