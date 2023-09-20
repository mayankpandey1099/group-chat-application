const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const messagesFile = path.join(__dirname, 'messages.json');

// Check if the messages file exists, and if not, create an empty array.
if (!fs.existsSync(messagesFile)) {
  fs.writeFileSync(messagesFile, '[]');
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username } = req.body;

  // Store the username in browser's local storage.
  res.cookie('username', username);

  // Redirect the user to the home page.
  res.redirect('/');
});

app.post('/send-message', (req, res) => {
  const { message } = req.body;
  const username = req.cookies.username;

  if (!username) {
    res.status(400).send('You are not logged in.');
    return;
  }

  // Read existing messages from the file.
  const messages = fs.readJsonSync(messagesFile);

  // Add the new message to the messages array.
  messages.push({ username, message });

  // Write the updated messages back to the file.
  fs.writeJsonSync(messagesFile, messages);

  res.redirect('/');
});

app.get('/get-messages', (req, res) => {
  // Read messages from the file and send them as JSON.
  const messages = fs.readJsonSync(messagesFile);
  res.json(messages);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
