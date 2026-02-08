// Authentication utility functions

// Function to hash a password
const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return bcrypt.hash(password, salt);
};

// Function to generate a token
const jwt = require('jsonwebtoken');
const generateToken = (user) => {
    return jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
};

// Function to verify a token
const verifyToken = (token) => {
    return jwt.verify(token, 'your_jwt_secret');
};

// Function to generate a verification code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

module.exports = { hashPassword, generateToken, verifyToken, generateVerificationCode };