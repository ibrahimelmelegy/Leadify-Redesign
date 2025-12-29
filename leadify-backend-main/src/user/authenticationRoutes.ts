import express, { Request, Response, NextFunction } from 'express';
import { loginUser, logoutUser, forgotPassword, resetPassword, checkResetToken, getUserProfile } from './authController';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Logs in a user and provides a token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       429:
 *         description: Too many failed attempts. Try again in 1 minute.
 *       200:
 *         description: Login successful, returns token
 *       401:
 *         description: Unauthorized, invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Authentication route for login
router.post('/auth/login', loginUser);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get user profile
 *     description: Returns the user profile associated with the provided token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/auth/me', getUserProfile);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logs out an authenticated user by invalidating their session.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: No token provided
 *       500:
 *         description: Server error
 */
// Logout route (authenticated users only)
router.post('/auth/logout', authenticateUser, logoutUser);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Sends a password reset email to the user with a reset link.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user requesting password reset
 *     responses:
 *       200:
 *         description: Password reset link sent
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
// Forgot password route
router.post('/auth/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Resets the user’s password using a valid token sent in the password reset email.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The password reset token
 *               newPassword:
 *                 type: string
 *                 description: The new password to set
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
// Reset password route
router.post('/auth/reset-password', resetPassword);

/**
 * @swagger
 * /api/auth/check-reset-token:
 *   post:
 *     summary: Check reset token
 *     description: Verifies if a password reset token is valid.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The password reset token to verify
 *     responses:
 *       200:
 *         description: Token is valid
 *       400:
 *         description: Invalid or expired token
 */
// Route to verify the reset token (optional for frontend validation)
router.post('/auth/check-reset-token', checkResetToken);

export default router;
