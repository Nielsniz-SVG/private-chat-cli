const chalk = require('chalk');
const inquirer = require('inquirer');
const { readData, writeData } = require('../database/storage');

// App settings
const appSettings = async () => {
  console.clear();
  console.log(chalk.cyan.bold('\n⚙️  APP SETTINGS\n'));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'setting',
      message: 'Select a setting:',
      choices: [
        { name: '🎨 Theme (Dark/Light)', value: 'theme' },
        { name: '🔔 Notifications', value: 'notifications' },
        { name: '🔒 Privacy', value: 'privacy' },
        { name: '📝 Auto-save', value: 'autosave' },
        { name: '↩️  Back', value: 'back' }
      ]
    }
  ]);

  if (answers.setting === 'back') return;

  console.log(chalk.yellow(`\n✨ ${answers.setting.toUpperCase()} setting selected`));
  console.log(chalk.gray('(Feature coming soon)\n'));

  await inquirer.prompt([
    { type: 'input', name: 'continue', message: 'Press Enter to continue...' }
  ]);

  await appSettings();
};

// Password settings
const passwordSettings = async (user) => {
  console.clear();
  console.log(chalk.cyan.bold('\n🔐 PASSWORD SETTINGS\n'));

  const answers = await inquirer.prompt([
    {
      type: 'password',
      name: 'currentPassword',
      message: 'Enter your current password:',
      mask: '*'
    }
  ]);

  const bcrypt = require('bcryptjs');
  const users = readData('users');
  const dbUser = users.find(u => u.id === user.id);

  const passwordMatch = await bcrypt.compare(answers.currentPassword, dbUser.password);

  if (!passwordMatch) {
    console.log(chalk.red('\n❌ Incorrect password\n'));
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    return;
  }

  const newPasswordAnswers = await inquirer.prompt([
    {
      type: 'password',
      name: 'newPassword',
      message: 'Enter new password:',
      mask: '*',
      validate: (input) => input.length >= 8 ? true : 'Password must be at least 8 characters'
    },
    {
      type: 'password',
      name: 'confirmPassword',
      message: 'Confirm new password:',
      mask: '*',
      validate: (input, answers) => input === answers.newPassword ? true : 'Passwords do not match'
    }
  ]);

  const hashedPassword = await bcrypt.hash(newPasswordAnswers.newPassword, 10);
  const userIndex = users.findIndex(u => u.id === user.id);
  users[userIndex].password = hashedPassword;
  writeData('users', users);

  console.log(chalk.green('\n✅ Password updated successfully!\n'));

  await inquirer.prompt([
    { type: 'input', name: 'continue', message: 'Press Enter to continue...' }
  ]);
};

module.exports = {
  appSettings,
  passwordSettings
};