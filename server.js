// server.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'super-secret-key',
  resave: false,
  saveUninitialized: true
}));
app.use('/resources', express.static(path.join(__dirname, 'resources')));

// View Engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));


app.use('/auth', require('./routes/auth'));
app.use('/videos', require('./routes/videos'));

// Routes
app.use('/auth', authRoutes);
app.use('/video', videoRoutes);

res.render('home'); // assuming views/home.pug exists


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));


app.use('/auth', require('./routes/auth'));
app.use('/videos', require('./routes/videos'));

// Redirect root
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.static('public'));

const fs = require('fs');
const uploadDir = path.join(__dirname, 'resources/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads folder at resources/uploads');
}
