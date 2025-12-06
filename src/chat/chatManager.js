const chalk = require('chalk');
const inquirer = require('inquirer');
const { generateId, readData, writeData, addData, findData } = require('../database/storage');

// Start new chat
const startNewChat = async (user) => {
  console.clear();
  console.log(chalk.cyan.bold('\n💬 START NEW CHAT\n'));

  const users = readData('users');
  const otherUsers = users.filter(u => u.id !== user.id && u.verified);

  if (otherUsers.length === 0) {
    console.log(chalk.yellow('No other verified users available\n'));
    return null;
  }

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'recipientId',
      message: 'Select user to chat with:',
      choices: otherUsers.map(u => ({
        name: `${u.username} (${u.email})`,
        value: u.id
      }))
    }
  ]);

  const recipient = users.find(u => u.id === answers.recipientId);
  const chat = {
    id: generateId(),
    participants: [user.id, recipient.id],
    createdAt: new Date().toISOString(),
    messages: []
  };

  addData('chats', chat);

  console.log(chalk.green(`\n✅ Chat with ${recipient.username} created!\n`));

  return chat;
};

// Get recent chats
const getRecentChats = async (user) => {
  const chats = readData('chats');
  const userChats = chats.filter(c => c.participants.includes(user.id));

  if (userChats.length === 0) {
    console.log(chalk.yellow('\nNo recent chats\n'));
    return null;
  }

  return userChats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Open chat
const openChat = async (user, chat) => {
  const recipient = readData('users').find(u => u.id === chat.participants.find(p => p !== user.id));

  await displayChatInterface(user, chat, recipient);
};

// Display chat interface (terminal style)
const displayChatInterface = async (user, chat, recipient) => {
  console.clear();
  console.log(chalk.cyan.bold(`
╔═══════════════════════════════════════════╗
║          CHAT WITH ${recipient.username.toUpperCase()}
║  ${chat.id.substring(0, 20)}...
╚═══════════════════════════════════════════╝
  `));

  // Display previous messages
  if (chat.messages && chat.messages.length > 0) {
    chat.messages.forEach(msg => {
      const isOwnMessage = msg.senderId === user.id;
      const prefix = isOwnMessage ? chalk.green('YOU') : chalk.blue(recipient.username.toUpperCase());
      const messageStyle = isOwnMessage ? chalk.green : chalk.cyan;
      console.log(`${prefix}: ${messageStyle(msg.content)}`);
    });
  }

  console.log(chalk.gray('\n─────────────────────────────────────────\n'));

  const messagePrompt = await inquirer.prompt([
    {
      type: 'input',
      name: 'message',
      message: chalk.cyan('> '),
      validate: (input) => input.length > 0 || 'Message cannot be empty'
    }
  ]);

  const message = messagePrompt.message;

  if (message === '/exit') {
    console.log(chalk.yellow('\n👋 Exiting chat...\n'));
    return;
  }

  if (message === '/clear') {
    await displayChatInterface(user, chat, recipient);
    return;
  }

  if (message === '/help') {
    console.clear();
    console.log(chalk.cyan.bold('\n📚 CHAT COMMANDS\n'));
    console.log(chalk.cyan('/exit') + ' - Exit the chat');
    console.log(chalk.cyan('/clear') + ' - Clear screen');
    console.log(chalk.cyan('/help') + ' - Show this help menu\n');
    
    await inquirer.prompt([{ type: 'input', name: 'continue', message: 'Press Enter to continue...' }]);
    await displayChatInterface(user, chat, recipient);
    return;
  }

  // Add message to chat
  const newMessage = {
    id: generateId(),
    senderId: user.id,
    content: message,
    timestamp: new Date().toISOString()
  };

  const chats = readData('chats');
  const chatIndex = chats.findIndex(c => c.id === chat.id);
  chats[chatIndex].messages.push(newMessage);
  writeData('chats', chats);

  // Continue chatting
  const updatedChat = chats[chatIndex];
  await displayChatInterface(user, updatedChat, recipient);
};

module.exports = {
  startNewChat,
  getRecentChats,
  openChat,
  displayChatInterface
};
