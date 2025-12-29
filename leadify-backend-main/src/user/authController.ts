import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from './userModel';
import LoginFailure from './models/loginFailureModel';
import Session from './models/sessionModel';
import ResetToken from './models/resetTokenModel';
import PasswordResetLog from './models/passwordResetLogModel';
import { getJwtSecret } from '../config/security';

dotenv.config();

const LOCK_TIME = 60 * 1000; // Lock time: 1 minute in milliseconds
const MAX_ATTEMPTS = 5; // Max failed attempts before lockout
const SECRET_KEY = getJwtSecret();

// Email configuration (using nodemailer)
const emailUser = (process.env.EMAIL_USER || '').trim();
const emailPass = (process.env.EMAIL_PASS || '').trim();
const transporter = emailUser && emailPass
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.office365.com',
      port: Number(process.env.EMAIL_PORT || 587),
      secure: (process.env.EMAIL_SECURE || '').toLowerCase() === 'true',
      auth: { user: emailUser, pass: emailPass }
    })
  : null;

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check recent login failures
    const recentFailures = await LoginFailure.count({
      where: {
        email,
        timestamp: { [Op.gte]: new Date(Date.now() - LOCK_TIME) } // Failures within the lock time
      }
    });

    if (recentFailures >= MAX_ATTEMPTS) {
      res.status(429).json({ message: 'Too many failed attempts. Please try again in 1 minute.' });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      await LoginFailure.create({ email, reason: 'User not found' });
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await LoginFailure.create({ email, reason: 'Invalid credentials' });
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION_TIME || ('7d' as any) });
    await Session.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + (Number(process.env.SESSION_EXPIRATION_TIME) || 7) * 24 * 60 * 60 * 1000)
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Server error' });
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return; // End function execution here
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };

    // Check if the session exists and is valid
    const session = await Session.findOne({ where: { userId: decoded.id, token } });
    if (!session) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    // Fetch the user data
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] } // Exclude password for security
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user data', error: error instanceof Error ? error.message : 'Server error' });
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return; // End function execution here
    }

    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    await Session.destroy({ where: { userId: decoded.id, token } });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed', error: error instanceof Error ? error.message : 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body;

  try {
    // Always return a generic message to reduce user enumeration risk.
    const user = await User.findOne({ where: { email } });
    if (user) {
      await ResetToken.destroy({ where: { userId: user.id } });

      const resetToken = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
      await ResetToken.create({
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      const appBaseUrl = (process.env.APP_BASE_URL || '').trim();
      const hostBase = appBaseUrl || `${req.protocol}://${req.get('host')}`;
      const resetLink = `${hostBase}/reset-password?token=${resetToken}`;

      if (transporter) {
        const mailOptions = {
          from: emailUser,
          to: user.email,
          subject: 'Password Reset Request',
          html: `
            <p>Hi,</p>
            <p>You requested a password reset. Please click the button below to reset your password. The link is valid for 24 hours.</p>
            <a href="${resetLink}" style="background-color:#007bff;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;">Reset Password</a>
            <p>If you did not request this, you can safely ignore this email.</p>
          `
        };

        try {
          await transporter.sendMail(mailOptions);
        } catch (e) {
          // Avoid leaking mail transport issues to the client
          console.error('Failed to send reset email:', e instanceof Error ? e.message : e);
        }
      } else {
        // Dev fallback: log link only when email isn't configured
        if ((process.env.NODE_ENV || '').toLowerCase() !== 'production') {
          console.log('Password reset link (dev):', resetLink);
        }
      }
    }

    res.status(200).json({ message: 'If an account exists for this email, a password reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Server error' });
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string; email: string };
    const resetToken = await ResetToken.findOne({
      where: {
        userId: decoded.id,
        token: token,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!resetToken) {
      await PasswordResetLog.create({ userId: Number(decoded.id), email: decoded.email, status: 'Failure' });
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      await PasswordResetLog.create({ userId: Number(decoded.id), email: decoded.email, status: 'Failure' });
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await Session.destroy({ where: { userId: user.id } });

    await PasswordResetLog.create({ userId: user.id, email: user.email, status: 'Success' });

    // const mailOptions = {
    //     from: process.env.EMAIL_USER as string,
    //     to: user.email,
    //     subject: 'Password Reset Notification',
    //     html: `<p>The user with email <b>${user.email}</b> has successfully reset their password.</p>`
    // };

    // await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Server error' });
  }
};

export const checkResetToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
    const resetToken = await ResetToken.findOne({
      where: {
        userId: decoded.id,
        token: token,
        expiresAt: { [Op.gt]: new Date() }
      }
    });
    if (!resetToken) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    res.status(200).json({ message: 'Token is valid', userId: decoded.id });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired token', error: error instanceof Error ? error.message : 'Server error' });
  }
};
