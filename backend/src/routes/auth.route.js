import express from 'express';

import * as authController from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.put('/update-profile', protectRoute, authController.updateProfile);

router.get('/check-auth', protectRoute, (req, res) => {
  return res.status(200).json({ message: 'Authorized', user: req.user });
});
export default router;
