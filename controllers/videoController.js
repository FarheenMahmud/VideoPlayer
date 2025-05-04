// controllers/videoController.js
const fs = require('fs');
const path = require('path');
const videosPath = path.join(__dirname, '../data/videos.json');

exports.getNewVideo = (req, res) => {
  if (!req.session.username) return res.redirect('/auth/login');
  res.render('new_video');
};

exports.postNewVideo = (req, res) => {
  const { title, category, url } = req.body;
  const videos = JSON.parse(fs.readFileSync(videosPath));
  videos.push({ title, category, url, uploader: req.session.username });
  fs.writeFileSync(videosPath, JSON.stringify(videos));
  res.redirect(`/video/dashboard/${category}`);
};

exports.getDashboard = (req, res) => {
  const filter = req.params.videofilter;
  const videos = JSON.parse(fs.readFileSync(videosPath));
  const filteredVideos = filter === 'all' ? videos : videos.filter(v => v.category === filter);
  res.render('dashboard', { username: req.session.username, videos: filteredVideos });
};
