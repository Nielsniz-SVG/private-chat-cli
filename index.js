#!/usr/bin/env node

require('dotenv').config();
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

// Import modules
const { register } = require('./src/auth/register');
const { login } = require('./src/auth/login');
const { mainMenu } = require('./src/menu/mainMenu');
const { ensureDataDirectory } = require('./src/database/storage');

// Initialize data directory
ensureDataDirectory();

// Welcome banner
const displayWelcome = () => {
  console.clear();
  console.log(chalk.cyan.bold(`
╔════════════════════════════════════════╗
║                                        ║
║   🔐 PRIVATE CHAT CLI 🔐              ║
║                                        ║
║   Secure Terminal Chat Application    ║
║                                        ║
╚════════════════════════════════════════╝
  `));
};

// Main authentication menu
const authMenu = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Welcome! What would you like to do?',
      choices: [
        { name: '📝 Register', value: 'register' },
        { name: '🔑 Login', value: 'login' },
        { name: '❌ Exit', value: 'exit' }
      ]
    }
  ]);

  switch (answers.action) {
    case 'register':
      await register();
      await authMenu();
      break;
    case 'login':
      const user = await login();
      if (user) {
        await mainMenu(user);
        await authMenu();
      } else {
        await authMenu();
      }
      break;
    case 'exit':
      console.log(chalk.yellow('\n👋 Goodbye! Thanks for using Private Chat CLI!\n'));
      process.exit(0);
  }
};

// Start the application
const start = async () => {
  displayWelcome();
  await authMenu();
};

// Run the app
start().catch(error => {
  console.error(chalk.red('❌ Error: ' + error.message));
  process.exit(1);
});
