import crypto from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../src/types';

const SESSION_COOKIE = 'xsj_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const SAFE_SOURCE_HOSTS = /(^|\.)(gov\.in|nic\.in|ac\.in)$/i;

type Session = { email: string; role: UserRole; exp: number };

declare global {
  namespace Express {
    interface Request { user?: Pick<Session, 'email' | 'role'> }
  }
}

function secret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must be at least 32 characters long');
  return value;
}

function sign(value: string) {
  return crypto.createHmac('sha256', secret()).update(value).digest('base64url');
}

function readCookie(req: Request, name: string): string | undefined {
  return req.headers.cookie?.split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`))?.slice(name.length + 1);
}

export function createSession(email: string, role: UserRole): string {
  const payload = Buffer.from(JSON.stringify({ email, role, exp: Date.now() + SESSION_TTL_MS })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

/** Verify an ADMIN_PASSWORD_HASH value encoded as scrypt$N$r$p$saltHex$hashHex. */
export function verifyPassword(password: unknown, encodedHash: string | undefined): boolean {
  if (typeof password !== 'string' || !encodedHash) return false;
  const [algorithm, n, r, p, saltHex, expectedHex] = encodedHash.split('$');
  if (algorithm !== 'scrypt' || !n || !r || !p || !saltHex || !expectedHex) return false;
  try {
    const expected = Buffer.from(expectedHex, 'hex');
    const derived = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length, {
      N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024
    });
    return expected.length === derived.length && crypto.timingSafeEqual(expected, derived);
  } catch { return false; }
}

function parseSession(token?: string): Session | null {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Session;
    return session.exp > Date.now() ? session : null;
  } catch { return null; }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = parseSession(readCookie(req, SESSION_COOKIE));
    if (!session) return res.status(401).json({ error: 'Authentication required' });
    if (!roles.includes(session.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    req.user = { email: session.email, role: session.role };
    next();
  };
}

export function setSessionCookie(res: Response, token: string) {
  res.cookie(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: SESSION_TTL_MS, path: '/' });
}

export function clearSessionCookie(res: Response) { res.clearCookie(SESSION_COOKIE, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/' }); }

export function validateOfficialUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !SAFE_SOURCE_HOSTS.test(url.hostname) || url.username || url.password || url.port) return null;
    return url.toString();
  } catch { return null; }
}
