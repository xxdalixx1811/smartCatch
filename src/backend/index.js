require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Helper to generate unique IDs
const { v4: uuidv4 } = require('uuid');

// In-memory messages (pre-filled with random data)
const messages = {
  Samar: [
    { sender: 'Samar', text: "Heyy how's SmartCatch going?", time: '10:01 AM' },
    { sender: 'Me', text: 'Haha slow but getting there 😅', time: '10:03 AM' },
    { sender: 'Samar', text: 'Lmk if you need help!', time: '10:05 AM' },
    { sender: 'Me', text: 'Thanks! Might ping you later.', time: '10:06 AM' },
    { sender: 'Samar', text: 'Anytime 🚀', time: '10:07 AM' },
    // Unread messages
    { sender: 'Samar', text: 'Did you see the new design I sent?', time: '11:00 AM' },
    { sender: 'Samar', text: 'Let me know what you think!', time: '11:01 AM' },
    { sender: 'Samar', text: 'Also, are you joining the call later?', time: '11:02 AM' },
    { sender: 'Samar', text: 'Ping me when you’re free.', time: '11:03 AM' },
  ],
  Aziz: [
    { sender: 'Aziz', text: 'Did you eat?', time: '9:30 AM' },
    { sender: 'Me', text: 'Not yet, just coding this messaging page 😪', time: '9:32 AM' },
    { sender: 'Aziz', text: '👀 take a break soon', time: '9:35 AM' },
    { sender: 'Me', text: 'Will do! Want to grab lunch later?', time: '9:36 AM' },
    { sender: 'Aziz', text: 'Sure, pizza?', time: '9:37 AM' },
    { sender: 'Me', text: 'Always 🍕', time: '9:38 AM' },
    // Unread messages
    { sender: 'Aziz', text: 'Bro, you there?', time: '10:00 AM' },
    { sender: 'Aziz', text: 'I found a new pizza place!', time: '10:01 AM' },
    { sender: 'Aziz', text: 'Let’s try it this weekend?', time: '10:02 AM' },
    { sender: 'Aziz', text: 'Text me back!', time: '10:03 AM' },
  ],
  'SmartCatch Team': [
    { sender: 'Teamleader', text: 'Let’s meet tomorrow at 10', time: '08:30 AM' },
    { sender: 'Me', text: 'Sure, works for me!', time: '08:31 AM' },
    { sender: 'Ahmed', text: 'Same here', time: '08:32 AM' },
    { sender: 'Samar', text: 'Can we also discuss the frontend?', time: '08:35 AM' },
    { sender: 'Aziz', text: 'Yes please', time: '08:36 AM' },
    { sender: 'Me', text: 'I’ll prepare a demo for the UI.', time: '08:37 AM' },
    { sender: 'Teamleader', text: 'Awesome, see you all tomorrow!', time: '08:38 AM' },
    // 20+ unread group messages
    ...Array.from({length: 22}, (_, i) => [
      { sender: 'Ahmed', text: `Update: API integration is ${80 + i}% done.`, time: `09:${10 + i} AM` },
      { sender: 'Samar', text: `Frontend PR #${100 + i} is ready for review.`, time: `09:${12 + i} AM` },
      { sender: 'Aziz', text: `Reminder: deploy to staging after merge.`, time: `09:${14 + i} AM` },
      { sender: 'Teamleader', text: `Check the new timeline in the doc.`, time: `09:${16 + i} AM` },
    ]).flat().slice(0, 22),
  ],
  "Mom": [
    { sender: "Mom", text: "Did you get home safe?", time: "7:15 PM" },
    { sender: "Me", text: "Yes, just arrived!", time: "7:16 PM" },
    { sender: "Mom", text: "Don’t forget to eat dinner.", time: "7:17 PM" },
    { sender: "Me", text: "I won’t! Love you ❤️", time: "7:18 PM" },
    { sender: "Mom", text: "Call me if you need anything.", time: "7:19 PM" },
    { sender: "Me", text: "Will do, goodnight!", time: "7:20 PM" },
    // Unread messages
    { sender: "Mom", text: "Don’t stay up too late!", time: "10:00 PM" },
    { sender: "Mom", text: "And remember to call your grandma.", time: "10:01 PM" },
    { sender: "Mom", text: "Love you!", time: "10:02 PM" },
  ],
  "Project X": [
    { sender: "Alice", text: "The deadline is next Friday.", time: "2:00 PM" },
    { sender: "Bob", text: "I’ll finish the backend by Tuesday.", time: "2:05 PM" },
    { sender: "Me", text: "I’ll handle the UI and connect the API.", time: "2:10 PM" },
    { sender: "Alice", text: "Let’s have a call tomorrow?", time: "2:12 PM" },
    { sender: "Bob", text: "Works for me. 3pm?", time: "2:13 PM" },
    { sender: "Me", text: "Perfect, see you then!", time: "2:14 PM" },
    { sender: "Alice", text: "Don’t forget to update the docs.", time: "2:15 PM" },
    { sender: "Me", text: "On it!", time: "2:16 PM" },
    // 20+ unread group messages
    ...Array.from({length: 20}, (_, i) => [
      { sender: 'Alice', text: `Design doc updated, see section ${i + 1}.`, time: `03:${10 + i} PM` },
      { sender: 'Bob', text: `Backend endpoint /api/v${i + 2} ready.`, time: `03:${12 + i} PM` },
    ]).flat(),
  ],
  "Football Buddies": [
    { sender: "Samir", text: "Game at 6pm, who’s in?", time: "11:00 AM" },
    { sender: "Me", text: "Count me in!", time: "11:01 AM" },
    { sender: "Youssef", text: "I’ll bring snacks 🍕", time: "11:02 AM" },
    { sender: "Samir", text: "Don’t be late this time 😂", time: "11:03 AM" },
    { sender: "Me", text: "No promises!", time: "11:04 AM" },
    { sender: "Youssef", text: "Let’s meet at the park entrance.", time: "11:05 AM" },
    { sender: "Samir", text: "See you all there!", time: "11:06 AM" },
    // 20+ unread group messages
    ...Array.from({length: 21}, (_, i) => [
      { sender: 'Samir', text: `Bring your A-game today!`, time: `12:${10 + i} PM` },
      { sender: 'Youssef', text: `I got new cleats!`, time: `12:${12 + i} PM` },
    ]).flat(),
  ],
  "Sister": [
    { sender: "Sister", text: "Can I borrow your headphones?", time: "8:00 AM" },
    { sender: "Me", text: "Sure, just don’t break them!", time: "8:01 AM" },
    { sender: "Sister", text: "No promises 😜", time: "8:02 AM" },
    { sender: "Me", text: "Haha, I trust you... kinda.", time: "8:03 AM" },
    { sender: "Sister", text: "Thanks! You’re the best.", time: "8:04 AM" },
    // Unread messages
    { sender: "Sister", text: "I made pancakes!", time: "9:00 AM" },
    { sender: "Sister", text: "Want some?", time: "9:01 AM" },
    { sender: "Sister", text: "I’ll save you one.", time: "9:02 AM" },
  ],
  "Book Club": [
    { sender: "Layla", text: "Next book: The Alchemist!", time: "5:00 PM" },
    { sender: "Me", text: "Great choice!", time: "5:01 PM" },
    { sender: "Omar", text: "I’ve already read it, but I’m in.", time: "5:02 PM" },
    { sender: "Layla", text: "Meeting Sunday at 4pm?", time: "5:03 PM" },
    { sender: "Me", text: "Works for me.", time: "5:04 PM" },
    { sender: "Omar", text: "I’ll bring cookies!", time: "5:05 PM" },
    { sender: "Layla", text: "See you all then!", time: "5:06 PM" },
    // 20+ unread group messages
    ...Array.from({length: 23}, (_, i) => [
      { sender: 'Layla', text: `Reminder: bring your favorite quote from chapter ${i + 1}.`, time: `06:${10 + i} PM` },
      { sender: 'Omar', text: `I finished chapter ${i + 1}!`, time: `06:${12 + i} PM` },
    ]).flat(),
  ],
};

// Update initial messages to have an 'id' field
Object.keys(messages).forEach(user => {
  messages[user] = messages[user].map(msg => ({ ...msg, id: uuidv4() }));
});

// Get messages for a user/conversation
app.get('/messages/:user', (req, res) => {
  const user = req.params.user;
  res.json(messages[user] || []);
});

// Post a new message to a user/conversation
app.post('/messages/:user', (req, res) => {
  const user = req.params.user;
  const { sender, text, time } = req.body;
  if (!messages[user]) messages[user] = [];
  const newMsg = { sender, text, time, id: uuidv4() };
  messages[user].push(newMsg);
  res.status(201).json({ success: true, message: newMsg });
});

// Delete a message by index (only if sender is 'Me')
app.delete('/messages/:user/:id', (req, res) => {
  const user = req.params.user;
  const id = req.params.id;
  if (!messages[user]) {
    return res.status(404).json({ error: 'Message not found' });
  }
  const idx = messages[user].findIndex(msg => msg.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: 'Message not found' });
  }
  if (messages[user][idx].sender !== 'Me') {
    return res.status(403).json({ error: 'Cannot delete messages sent by others' });
  }
  messages[user].splice(idx, 1);
  res.json({ success: true });
});

app.post('/summarize', async (req, res) => {
  const allMessages = Object.entries(messages)
    .map(([chat, msgs]) => `Chat: ${chat}\n` + msgs.map(m => `${m.sender}: ${m.text}`).join('\n'))
    .join('\n\n');

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: allMessages.slice(0, 2000) }),
      }
    );
    const data = await response.json();
    console.log('Hugging Face API response:', data); // Log the response
    if (data && data[0] && data[0].summary_text) {
      res.json({ summary: data[0].summary_text });
    } else {
      res.status(500).json({ error: 'Failed to summarize.' });
    }
  } catch (err) {
    console.error('Summarization error:', err); // Log the error
    res.status(500).json({ error: 'Failed to summarize.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
}); 