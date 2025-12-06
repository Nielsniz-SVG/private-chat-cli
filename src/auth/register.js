const chalk = require('chalk');
const inquirer = require('inquirer');
const nodemailer = require('nodemailer');
const { generateId, addData, findData, readData, writeData } = require('../database/storage');
const {
  hashPassword,
  isValidEmail,
  isStrongPassword,
  isValidUsername,
  generateVerificationCode
} = require('./utils');

let transporter;

// Initialize email transporter
const initializeTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }
  return transporter;
};

// Send verification email
const sendVerificationEmail = async (email, code) => {
  try {
    const transporter = initializeTransporter();
    
    // For demo purposes, log the code instead of sending
    console.log(chalk.yellow(`\n📧 Verification Code: ${chalk.bold(code)}\n`));
    
    return true;
  } catch (error) {
    console.error(chalk.red('Error sending email:', error.message));
    return false;
  }
};

// Register new user
const register = async () => {
  console.clear();
  console.log(chalk.cyan.bold('\n📝 REGISTER NEW ACCOUNT\n'));

  // Get email
  const emailAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Enter your email:',
      validate: (input) => {
        if (!isValidEmail(input)) {
          return 'Please enter a valid email address';
        }
        const users = readData('users');
        if (users.find(u => u.email === input)) {
          return 'Email already registered';
        }
        return true;
      }
    }
  ]);

  // Get username
  const usernameAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Choose a username:',
      validate: (input) => {
        if (!isValidUsername(input)) {
          return 'Username must be 3+ chars and contain only letters, numbers, _, -';
        }
        const users = readData('users');
        if (users.find(u => u.username === input)) {
          return 'Username already taken';
        }
        return true;
      }
    }
  ]);

  // Get password
  const passwordAnswers = await inquirer.prompt([
    {
      type: 'password',
      name: 'password',
      message: 'Create a password:',
      mask: '*',
      validate: (input) => {
        if (!isStrongPassword(input)) {
          return 'Password must be at least 8 characters long';
        }
        return true;
      }
    },
    {
      type: 'password',
      name: 'confirmPassword',
      message: 'Confirm your password:',
      mask: '*',
      validate: (input, answers) => {
        if (input !== answers.password) {
          return 'Passwords do not match';
        }
        return true;
      }
    }
  ]);

  try {
    // Hash password
    const hashedPassword = await hashPassword(passwordAnswers.password);

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Create user object
    const newUser = {
      id: generateId(),
      email: emailAnswers.email,
      username: usernameAnswers.username,
      password: hashedPassword,
      verified: false,
      verificationCode: verificationCode,
      createdAt: new Date().toISOString()
    };

    // Add user to database
    addData('users', newUser);

    // Send verification email
    const emailSent = await sendVerificationEmail(emailAnswers.email, verificationCode);

    if (emailSent) {
      console.log(chalk.green('\n✅ Registration successful!'));
      console.log(chalk.yellow(`Please check your email for verification code\n`));

      // Verify email
      await emailVerification(newUser);
    }
  } catch (error) {
    console.error(chalk.red('❌ Registration failed:', error.message));
  }
};

// Email verification
const emailVerification = async (user) => {
  console.log(chalk.cyan.bold('\n📧 EMAIL VERIFICATION\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'code',
      message: 'Enter the verification code sent to your email:',
      validate: (input) => input.length === 6 ? true : 'Code must be 6 digits'
    }
  ]);

  // Get user from database
  let users = readData('users');
  const dbUser = users.find(u => u.id === user.id);

  if (dbUser && dbUser.verificationCode === answers.code) {
    // Update user as verified
    dbUser.verified = true;
    delete dbUser.verificationCode;
    writeData('users', users);

    console.log(chalk.green('\n✅ Email verified successfully!'));
    console.log(chalk.cyan('You can now login to your account\n'));
  } else {
    console.log(chalk.red('\n❌ Invalid verification code\n'));
  }
};

module.exports = {
  register,
  emailVerification,
  sendVerificationEmail
};