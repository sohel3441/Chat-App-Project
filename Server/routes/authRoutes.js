import express from 'express';
import { googleLogin } from '../controllers/authController.js';

const googleRouter = express.Router();

googleRouter.post('/google-login', googleLogin);

export default googleRouter;