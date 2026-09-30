import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { db } from './db';
import { User } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'cozy-skein-super-secret-jwt-key-2026';
const COOKIE_NAME = 'cozy_auth_token';

export interface TokenPayload {
  userId: number;
  email: string;
  role: 'customer' | 'admin';
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}

export function getSessionUser(): User | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const row = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(payload.userId) as User | undefined;
    return row || null;
  } catch (err) {
    return null;
  }
}

export { COOKIE_NAME };
