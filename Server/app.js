import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
// import authRouter from './routes/authRoutes.js';
import googleRouter from './routes/authRoutes.js';
import quoteRouter from './routes/quoteRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true}));
app.use(express.json());

// Routes
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRouter);
app.use('/api/auth', googleRouter);
app.use('/api/quotes', quoteRouter);

export default app;