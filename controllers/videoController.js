const fs = require('fs');
const path = require('path');

const videosPath = path.join(__dirname, '..', 'data', 'videos.json');

function loadVideos() {
    try {
        const data = fs.readFileSync(videosPath, 'utf8');
        const videos = JSON.parse(data);
        console.log("Loaded videos:", videos);
        return videos;
    } catch (err) {
        console.error('Failed to load videos:', err);
        return [];
    }
}

function extractYouTubeId(url) {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

exports.postNewVideo = (req, res) => {
    const { title, category, url } = req.body;
    const uploader = req.session.name;
    const embedUrl = convertToEmbedUrl(url); // Corrected version

    if (!title || !category || !url) {
        return res.render('new_video', { error: 'All fields are required.' });
    }

    const newVideo = { title, category, url: embedUrl || url, uploader }; //use embedUrl

    try {
        const videos = loadVideos();
        videos.push(newVideo);
        fs.writeFileSync(videosPath, JSON.stringify(videos, null, 2), 'utf8');
        res.redirect('/video/dashboard/mine');
    } catch (error) {
        console.error("Error saving new video", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.getDashboard = (req, res) => {
    const filter = req.params.videofilter;
    const videos = loadVideos();
    const filteredVideos = (filter === 'All') ? videos : videos.filter(v => v.category === filter);

    filteredVideos.forEach(video => {
        video.youtubeId = extractYouTubeId(video.url); // Use the corrected function
    });

    res.render('dashboard', {
        user: req.session.user,
        videos: filteredVideos,
    });
};

exports.getNewVideo = (req, res) => {
    if (!req.session.name) {
        return res.redirect('/auth/login');
    }
    res.render('new_video');
};

function convertToEmbedUrl(youtubeUrl) {
    const videoId = extractYouTubeId(youtubeUrl);
    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
}