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
  const { username, password } = req.body;
  const users = safeReadJSON(usersPath);

  if (users.find(user => user.username === username)) {
    return res.status(400).send('User already exists');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    req.session.username = username;
    res.redirect('/video/dashboard/all');
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Server error');
  }
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  const users = safeReadJSON(usersPath);

  // Find the user by username
  const user = users.find(u => u.username === username);
  if (!user) {
    console.log('User not found:', username);
    return res.status(401).send('Invalid credentials');
  }

  try {
    // Compare the entered password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Password mismatch for user:', username);
      return res.status(401).send('Invalid credentials');
    }

    req.session.username = username;
    res.redirect('/video/dashboard/all');
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Server error');
  }
};
