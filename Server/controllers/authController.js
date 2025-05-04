// import User from '../models/User.js';
import { verifyGoogleToken } from '../services/googleAuth.service.js';
import Google from '../models/Google.js';


export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Token is required' });

    const userData = await verifyGoogleToken(token);

    // Check if user exists or create
    let user = await Google.findOne({ googleId: userData.googleId });

    if (!user) {
      user = await Google.create({
        googleId: userData.googleId,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      });
    }

    // You may return a session or JWT token here
    res.status(200).json({
      success: true,
      user,
      message: 'Login successful',
    });

  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: 'Invalid Google token' });
  }
};

