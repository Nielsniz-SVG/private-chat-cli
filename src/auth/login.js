const chalk = require('chalk');
const inquirer = require('inquirer');
const { readData, writeData, generateId } = require('../database/storage');
const { comparePassword, generateToken, generateVerificationCode } = require('./utils');
const { sendVerificationEmail } = require('./register');

// Login user
const login = async () => {
  console.clear();
  console.log(chalk.cyan.bold('\n🔑 LOGIN\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'Enter your email:'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Enter your password:',
      mask: '*'
    }
  ]);

  try {
    const users = readData('users');
    const user = users.find(u => u.email === answers.email);

    if (!user) {
      console.log(chalk.red('\n❌ User not found\n'));
      return null;
    }

    if (!user.verified) {
      console.log(chalk.red('\n❌ Please verify your email first\n'));
      return null;
    }

    const passwordMatch = await comparePassword(answers.password, user.password);

    if (!passwordMatch) {
      console.log(chalk.red('\n❌ Invalid password\n'));
      return null;
    }

    // Generate verification code for login
    const verificationCode = generateVerificationCode();
    
    // Update user with verification code
    const userIndex = users.findIndex(u => u.id === user.id);
    users[userIndex].loginVerificationCode = verificationCode;
    writeData('users', users);

    // Send verification email
    await sendVerificationEmail(answers.email, verificationCode);

    console.log(chalk.green('\n✅ Password correct!'));
    console.log(chalk.yellow(`📧 Verification code sent to your email\n`));

    // Verify login
    const verified = await verifyLogin(user);

    if (verified) {
      // Generate session token
      const token = generateToken(user);

      // Create session
      const session = {
        id: generateId(),
        userId: user.id,
        token: token,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      // Save session
      const sessions = readData('sessions');
      sessions.push(session);
      writeData('sessions', sessions);

      console.log(chalk.green('\n✅ Login successful!\n'));

      return {
        ...user,
        token: token
      };
    }

    return null;
  } catch (error) {
    console.error(chalk.red('❌ Login failed:', error.message));
    return null;
  }
};

// Verify login with email code
const verifyLogin = async (user) => {
  console.log(chalk.cyan.bold('\n📧 LOGIN VERIFICATION\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'code',
      message: 'Enter the verification code sent to your email:',
      validate: (input) => input.length === 6 ? true : 'Code must be 6 digits'
    }
  ]);

  const users = readData('users');
  const dbUser = users.find(u => u.id === user.id);

  if (dbUser && dbUser.loginVerificationCode === answers.code) {
    delete dbUser.loginVerificationCode;
    writeData('users', users);
    return true;
  } else {
    console.log(chalk.red('\n❌ Invalid verification code\n'));
    return false;
  }
};

module.exports = {
  login,
  verifyLogin
};