const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt'); 

const usersPath = path.join(__dirname, '../data/users.json');

function safeReadJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data ? JSON.parse(data) : [];
  } catch (err) {
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

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
  req.session.username = username;
  res.redirect('/video/dashboard/all');
};

exports.getLogin = (req, res) => {
  res.render('login');
};

exports.postLogin = async (req, res) => {
  const { username, password } = req.body;
  const users = safeReadJSON(usersPath);

  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).send('Invalid credentials');

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).send('Invalid credentials');

  req.session.username = username;
  res.redirect('/video/dashboard/all');
};
