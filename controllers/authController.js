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
  const { username, password } = req.body;
  const users = safeReadJSON(usersPath);

  console.log('Received login request:', username); // Log the username for debugging

  const user = users.find(u => u.username === username);
  if (!user) {
    console.log('User not found:', username); // Log if the user is not found
    return res.status(401).send('Invalid credentials');
  }

  try {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Password mismatch for user:', username); // Log if the password doesn't match
      return res.status(401).send('Invalid credentials');
    }

    req.session.username = username;
    console.log('Login successful:', username); // Log when login is successful
    res.redirect('/video/dashboard/all');
  } catch (err) {
    console.error('Error during login:', err); // Log any unexpected errors
    res.status(500).send('Server error');
  }
};

