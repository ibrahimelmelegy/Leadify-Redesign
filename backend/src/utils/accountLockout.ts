import { Op } from 'sequelize';

interface LoginAttempt {
  count: number;
  lastAttempt: Date;
  lockedUntil?: Date;
}

const loginAttempts: Map<string, LoginAttempt> = new Map();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;
const ATTEMPT_WINDOW = 15 * 60 * 1000;

export function recordFailedAttempt(identifier: string): { locked: boolean; remainingAttempts: number; lockoutMinutes?: number } {
  const now = new Date();
  const existing = loginAttempts.get(identifier);

  if (existing?.lockedUntil && existing.lockedUntil > now) {
    const remainingMinutes = Math.ceil((existing.lockedUntil.getTime() - now.getTime()) / 60000);
    return { locked: true, remainingAttempts: 0, lockoutMinutes: remainingMinutes };
  }

  if (existing && (now.getTime() - existing.lastAttempt.getTime()) > ATTEMPT_WINDOW) {
    loginAttempts.delete(identifier);
  }

  const current = loginAttempts.get(identifier) || { count: 0, lastAttempt: now };
  current.count++;
  current.lastAttempt = now;

  if (current.count >= MAX_ATTEMPTS) {
    current.lockedUntil = new Date(now.getTime() + LOCKOUT_DURATION);
    loginAttempts.set(identifier, current);
    return { locked: true, remainingAttempts: 0, lockoutMinutes: Math.ceil(LOCKOUT_DURATION / 60000) };
  }

  loginAttempts.set(identifier, current);
  return { locked: false, remainingAttempts: MAX_ATTEMPTS - current.count };
}

export function clearAttempts(identifier: string): void {
  loginAttempts.delete(identifier);
}

export function isLocked(identifier: string): { locked: boolean; lockoutMinutes?: number } {
  const existing = loginAttempts.get(identifier);
  if (!existing?.lockedUntil) {
    return { locked: false };
  }

  const now = new Date();
  if (existing.lockedUntil > now) {
    const remainingMinutes = Math.ceil((existing.lockedUntil.getTime() - now.getTime()) / 60000);
    return { locked: true, lockoutMinutes: remainingMinutes };
  }

  loginAttempts.delete(identifier);
  return { locked: false };
}

export function getAttemptInfo(identifier: string): { attempts: number; maxAttempts: number; locked: boolean } {
  const existing = loginAttempts.get(identifier);
  if (!existing) {
    return { attempts: 0, maxAttempts: MAX_ATTEMPTS, locked: false };
  }

  const now = new Date();
  const locked = existing.lockedUntil ? existing.lockedUntil > now : false;

  return {
    attempts: existing.count,
    maxAttempts: MAX_ATTEMPTS,
    locked,
  };
}

setInterval(() => {
  const now = new Date();
  for (const [key, value] of loginAttempts.entries()) {
    if (value.lockedUntil && value.lockedUntil < now) {
      loginAttempts.delete(key);
    } else if ((now.getTime() - value.lastAttempt.getTime()) > ATTEMPT_WINDOW * 2) {
      loginAttempts.delete(key);
    }
  }
}, 5 * 60 * 1000);
