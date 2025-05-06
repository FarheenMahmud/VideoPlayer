const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const authMiddleware = require('../middleware/authMiddleware');
const videos = require('../data/videos.json');

router.get('/new_video', authMiddleware, videoController.getNewVideo);
router.post('/new', authMiddleware, videoController.postNewVideo);
router.get('/dashboard/:videofilter', authMiddleware, videoController.getDashboard);

module.exports = router;

function extractYouTubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? match[1] : null;
}



