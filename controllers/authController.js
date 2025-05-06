const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersPath = path.join(__dirname, '../data/users.json');

// Utility function to safely read JSON from a file
function safeReadJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
}

exports.getRegister = (req, res) => {
  res.render('register');
};

exports.postRegister = async (req, res) => {
  const { email, name, password } = req.body;
  const users = safeReadJSON(usersPath);

  if (!email || !name || !password) {
    return res.render('register', { error: 'All fields are required.' });
  }

  if (users.find(user => user.email === email)) {
    return res.render('register', { error: 'User already exists.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, name, password: hashedPassword });

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    res.render('account_created', { email });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Server error');
  }
};


exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const users = safeReadJSON(usersPath);

  if (!email || !password) {
    return res.render('login', { error: 'All fields are required.' });
  }

  const user = users.find(u => u.email === email);
  if (!user) {
    return res.render('login', { error: 'Invalid credentials.' });
  }

  try {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.render('login', { error: 'Invalid credentials.' });
    }

    req.session.email = user.email;
    req.session.name = user.name;
    res.redirect('/video/dashboard/all');
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Server error');
  }
};


