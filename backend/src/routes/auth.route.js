import express from 'express';

import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', authController.signup);

router.get('/login', authController.login);

router.get('/logout', authController.logout);
export default router;
