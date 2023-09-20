document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.querySelector('form');
  const messagesList = document.getElementById('messages');

  messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageInput = messageForm.querySelector('input[name="message"]');
    const message = messageInput.value;

    // Send the message to the server.
    await fetch('/send-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `message=${encodeURIComponent(message)}`,
    });

    messageInput.value = '';
  });

  async function fetchMessages() {
    const response = await fetch('/get-messages');
    const messages = await response.json();

    messagesList.innerHTML = '';
    messages.forEach((msg) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${msg.username}: ${msg.message}`;
      messagesList.appendChild(listItem);
    });

    // Scroll to the bottom of the chat.
    messagesList.scrollTop = messagesList.scrollHeight;
  }

  // Fetch messages when the page loads and then every 2 seconds.
  fetchMessages();
  setInterval(fetchMessages, 2000);
});
