import Chat from '../models/Chat.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

// Get all chats with user info
export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate('user', 'firstName lastName')
      .populate('messages');

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new chat with user info
export const createChat = async (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First and last name are required' });
  }

  try {
    const newUser = await User.create({ firstName, lastName });
    const newChat = await Chat.create({ user: newUser._id });

    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

// Update user's name in chat
export const updateChat = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;

  try {
    const chat = await Chat.findById(id);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    await User.findByIdAndUpdate(chat.user, { firstName, lastName });
    res.json({ message: 'Chat updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update chat' });
  }
};

// Delete a chat and related user + messages
export const deleteChat = async (req, res) => {
  const { id } = req.params;

  try {
    const chat = await Chat.findById(id);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    await Message.deleteMany({ chat: chat._id });
    await User.findByIdAndDelete(chat.user);
    await chat.deleteOne();

    res.json({ message: 'Chat deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};
