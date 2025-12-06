const chalk = require('chalk');
const inquirer = require('inquirer');
const { readData, writeData } = require('../database/storage');

// View profile
const viewProfile = async (user) => {
  console.clear();
  console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════════╗
║           👤 USER PROFILE                 ║
╚═══════════════════════════════════════════╝
  `));

  console.log(chalk.cyan('Username:     ') + chalk.white(user.username));
  console.log(chalk.cyan('Email:        ') + chalk.white(user.email));
  console.log(chalk.cyan('Account ID:   ') + chalk.white(user.id.substring(0, 16) + '...'));
  console.log(chalk.cyan('Verified:     ') + chalk.green('✅ Yes'));
  console.log(chalk.cyan('Created:      ') + chalk.white(new Date(user.createdAt).toLocaleDateString()));

  // Count chats
  const chats = readData('chats');
  const userChats = chats.filter(c => c.participants.includes(user.id));
  console.log(chalk.cyan('Total Chats:  ') + chalk.white(userChats.length));

  console.log();

  await inquirer.prompt([
    { type: 'input', name: 'continue', message: 'Press Enter to go back...' }
  ]);
};

// Edit profile
const editProfile = async (user) => {
  console.clear();
  console.log(chalk.cyan.bold('\n✏️  EDIT PROFILE\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'New username (or press Enter to keep current):',
      default: user.username,
      validate: (input) => {
        if (input && input.length < 3) {
          return 'Username must be at least 3 characters';
        }
        return true;
      }
    }
  ]);

  const users = readData('users');
  const userIndex = users.findIndex(u => u.id === user.id);

  if (answers.username && answers.username !== user.username) {
    if (users.some(u => u.username === answers.username)) {
      console.log(chalk.red('\n❌ Username already taken\n'));
      return;
    }
    users[userIndex].username = answers.username;
  }

  writeData('users', users);
  console.log(chalk.green('\n✅ Profile updated successfully!\n'));

  await inquirer.prompt([
    { type: 'input', name: 'continue', message: 'Press Enter to continue...' }
  ]);
};

module.exports = {
  viewProfile,
  editProfile
};