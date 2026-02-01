import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import { generateToken } from '../../lib/utils.js';
import { sendWelcomeEmail } from '../emails/email-handlers.js';
import { requireEnv } from '../../lib/env.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ fullName, email, password: hashedPassword });
    if (!newUser) {
      return res.status(400).json({ message: 'User creation failed.' });
    }
    const savedUser = await newUser.save();

    generateToken(savedUser._id, res);

    await sendWelcomeEmail(
      savedUser.email,
      savedUser.fullName,
      requireEnv('CLIENT_URL'),
    );

    return res.status(201).json({
      id: savedUser._id,
      fullName: savedUser.fullName,
      email: savedUser.email,
      profilePic: savedUser.profilePic,
    });
  } catch (error) {
    console.error(`Error during signup: ${error.message}`);
    return res.status(500).json({ message: 'Server error.' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error(`Error during login: ${error.message}`);
    return res.status(500).json({ message: 'Server error.' });
  }
};

export const logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 });
  return res.status(200).json({ message: 'Logged out successfully.' });
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).json({ message: 'Not authorized.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: 'http://localhost:3000/images/profile.jpg' }, // Example update, replace with actual data from req.body
      { new: true },
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Error updating profile: ${error.message}`);
    return res.status(500).json({ message: 'Server error.' });
  }
};
