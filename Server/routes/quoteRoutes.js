import express from 'express';
import { getRandomQuote } from '../controllers/quoteController.js';

const quoteRouter = express.Router();

quoteRouter.get('/', getRandomQuote);

export default quoteRouter;