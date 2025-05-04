import express from 'express';
import {
  getAllChats,
  createChat,
  updateChat,
  deleteChat,
} from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.get('/', getAllChats);
chatRouter.post('/', createChat);
chatRouter.put('/:id', updateChat);
chatRouter.delete('/:id', deleteChat);

export default chatRouter;
