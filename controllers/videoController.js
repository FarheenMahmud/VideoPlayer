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

  if (!title || !category || !url) {
    return res.render('new_video', { error: 'All fields are required.' });
  }

  const videos = JSON.parse(fs.readFileSync(videosPath));
  videos.push({ title, category, url, uploader: req.session.email });
  fs.writeFileSync(videosPath, JSON.stringify(videos, null, 2));

  res.render('new_video', { success: 'Video added successfully.' });
};


  
  

  exports.getDashboard = (req, res) => {
    const filter = req.params.videofilter;
    const videos = JSON.parse(fs.readFileSync(videosPath));
    let filteredVideos = [];
  
    if (filter === 'all') {
      filteredVideos = videos;
    } else if (filter === 'mine') {
      filteredVideos = videos.filter(v => v.uploader === req.session.email);
    }
  
    res.render('dashboard', { name: req.session.name, videos: filteredVideos });
  };
  
