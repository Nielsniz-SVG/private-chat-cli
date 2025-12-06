const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    process.env.JWT_SECRET || 'default-secret-key',
    { expiresIn: '7d' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key');
  } catch (error) {
    return null;
  }
};

// Generate verification code
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
const isStrongPassword = (password) => {
  return password.length >= 8;
};

// Validate username
const isValidUsername = (username) => {
  return username.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(username);
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateVerificationCode,
  isValidEmail,
  isStrongPassword,
  isValidUsername
};