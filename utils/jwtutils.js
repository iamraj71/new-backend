import jwt from 'jsonwebtoken';
import secretkey from '../jwtconfig.js';

const generatetoken = (user) => {
    const payload = {
        id: user._id, 
        email: user.email
    };
    
    return jwt.sign(payload, secretkey, { expiresIn: '24h' });
};

export default generatetoken;
