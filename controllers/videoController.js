// controllers/videoController.js
const fs = require('fs');
const path = require('path');
const videosPath = path.join(__dirname, '../data/videos.json');

exports.getNewVideo = (req, res) => {
  if (!req.session.username) return res.redirect('/auth/login');
  res.render('new_video');
};

exports.postNewVideo = (req, res) => {
    const { title, category } = req.body;
    const videoFile = req.file;
  
    if (!videoFile) return res.status(400).send('No video uploaded');
  
    const videoUrl = `/resources/uploads/${videoFile.filename}`;
    const videos = JSON.parse(fs.readFileSync(videosPath));
    videos.push({ title, category, url: videoUrl, uploader: req.session.username });
    fs.writeFileSync(videosPath, JSON.stringify(videos, null, 2));
  
    res.redirect(`/video/dashboard/${category}`);
  };
  
  

exports.getDashboard = (req, res) => {
  const filter = req.params.videofilter;
  const videos = JSON.parse(fs.readFileSync(videosPath));
  const filteredVideos = filter === 'all' ? videos : videos.filter(v => v.category === filter);
  res.render('dashboard', { username: req.session.username, videos: filteredVideos });
};
