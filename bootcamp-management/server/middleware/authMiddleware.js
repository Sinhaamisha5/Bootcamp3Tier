import jwt from 'jsonwebtoken';
import User from '../models/user.js';

/**
 * Verifies the JWT provided in the `token` cookie.  On success attaches
 * the full user document (without password) to req.user.  Returns 401
 * if no token or 403 if invalid.
 */
export async function authenticateToken(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.sendStatus(401);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.sendStatus(401);
    }
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.sendStatus(403);
  }
}

/**
 * Restricts access to routes to users with any of the specified roles.  Usage:
 * `authorizeRoles('admin', 'trainer')`.
 */
export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
}