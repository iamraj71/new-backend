import jwt from 'jsonwebtoken';
import secretkey from '../jwtconfig.js';

function authanticateToken(req, res, next) {
    const authHeader = typeof req.header === 'function'
        ? req.header('Authorization')
        : req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    jwt.verify(token, secretkey, (error, user) => {
        if (error) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    });
}

export default authanticateToken;