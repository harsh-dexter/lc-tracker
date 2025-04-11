import express from 'express';
import passport from 'passport';
import { ensureAuth, ensureGuest } from '../middleware/auth.js';


const router = express.Router();

import dotenv from 'dotenv';

dotenv.config();

// Get frontend URL from environment variables with fallback to localhost
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// @desc    Auth with Google
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect to frontend dashboard after successful login
    res.redirect(`${FRONTEND_URL}/dashboard`); // Updated from '/dashboard.html' to '/dashboard'
  }
);

// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    // Redirect to frontend home page after logout
    res.redirect(FRONTEND_URL);
  });
});

// @desc    Get current user
// @route   GET /auth/status
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user.id,
        googleId: req.user.googleId,
        displayName: req.user.displayName,
        email: req.user.email,
        hasLeetcodeSessionKey: !!req.user.leetcodeSessionKey
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

export default router;