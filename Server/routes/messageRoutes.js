import express from 'express';
import {
  sendMessage,
  updateMessage,
} from '../controllers/messageController.js';

const messageRouter = express.Router();

messageRouter.post('/', sendMessage);
messageRouter.put('/:id', updateMessage);

export default messageRouter;
