import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import axios from 'axios';
import { getRandomQuote } from '../utils/quotes.js';


// Send message and respond with quote after 3 sec
export const sendMessage = async (req, res) => {
    const { chatId, text } = req.body;
  
    if (!chatId || !text) {
      return res.status(400).json({ error: 'Chat ID and message text are required' });
    }
  
    try {
      // Save user's message
      const newMsg = await Message.create({
        chat: chatId,
        text,
        sender: 'user',
      });
  
      await Chat.findByIdAndUpdate(chatId, { $push: { messages: newMsg._id } });
  
      // Simulate delayed bot response
      setTimeout(async () => {
        const quote = getRandomQuote(); // ✅ local, no axios
  
        const botMsg = await Message.create({
          chat: chatId,
          text: quote,
          sender: 'bot',
        });
  
        await Chat.findByIdAndUpdate(chatId, { $push: { messages: botMsg._id } });
  
        // Optional: emit to Socket.io if needed
        // io.to(chatId).emit('message', botMsg);
      }, 1000);
  
      res.status(201).json(newMsg);
    } catch (err) {
      console.error('Message send error:', err.message);
      res.status(500).json({ error: 'Failed to send message' });
    }
  };
  

// Update own message
export const updateMessage = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const msg = await Message.findById(id);
    if (!msg || msg.sender !== 'user') {
      return res.status(404).json({ error: 'Only user messages can be edited' });
    }

    msg.text = text;
    await msg.save();

    res.json({ message: 'Message updated', msg });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update message' });
  }
};