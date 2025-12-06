# 🔐 Private Chat CLI

A secure, terminal-based private chat application with email authentication and double verification. Chat securely from your command line!

## ✨ Features

- ✅ **Secure Registration** - Create account with email, password, and username
- ✅ **Double Email Verification** - Verify email with verification codes
- ✅ **Secure Authentication** - JWT-based session management
- ✅ **Private Chats** - Start private conversations with terminal-style interface
- ✅ **User Profile** - Manage your profile and preferences
- ✅ **Recent Chats** - Quick access to recent conversations
- ✅ **Settings** - Customize your experience
- ✅ **Terminal UI** - Beautiful Linux-style command interface

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Nielsniz-SVG/private-chat-cli.git
cd private-chat-cli

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your email configuration
```

### Usage

```bash
# Start the application
npm start

# Or with auto-reload (development)
npm run dev
```

## 📋 How to Use

### 1. **First Time Setup**
- Run the app with `npm start`
- Select "Register" from the main menu
- Enter your email, create a password, and choose a username
- Verify your email with the code sent to your inbox

### 2. **Login**
- Select "Login" from the main menu
- Enter your email and password
- Complete the email verification

### 3. **Main Menu**
Once logged in, you have access to:
- **👤 Profile** - View and edit your profile
- **💬 New Chat** - Start a private chat with another user
- **📨 Recent Chats** - Access your recent conversations
- **⚙️ Settings** - Configure app preferences
- **👥 Profile Settings** - Manage your account

### 4. **Chat Interface**
- Use the terminal-style command interface
- Type messages naturally
- Commands available: `/help`, `/exit`, `/clear`

## 📁 Project Structure

```
private-chat-cli/
├── index.js                 # Main entry point
├── package.json             # Dependencies
├── .env.example             # Environment template
├── README.md
├── src/
│   ├── auth/
│   │   ├── register.js      # User registration
│   │   ├── login.js         # User login
│   │   ├── emailVerification.js   # Email verification
│   │   └── utils.js         # Auth utilities
│   ├── chat/
│   │   ├── chatManager.js   # Chat management
│   │   ├── messageHandler.js # Message handling
│   │   └── chatUI.js        # Chat interface
│   ├── user/
│   │   ├── profile.js       # User profile
│   │   └── settings.js      # User settings
│   ├── database/
│   │   └── storage.js       # Local storage
│   └── menu/
│       └── mainMenu.js      # Main menu
└── data/                    # Local storage
    ├── users.json
    ├── chats.json
    └── sessions.json
```

## 🔒 Security Features

- **Password Hashing** - bcryptjs encryption
- **Email Verification** - Double authentication
- **JWT Tokens** - Secure session management
- **Local Storage** - All data stored locally (no cloud)

## 🛠️ Technologies Used

- **inquirer** - Interactive CLI prompts
- **chalk** - Terminal colors
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Session tokens
- **nodemailer** - Email verification
- **uuid** - Unique identifiers

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
JWT_SECRET=your-super-secret-key
NODE_ENV=development
```

## 📝 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Created by **Nielsniz-SVG**

## 🤝 Contributing

Feel free to fork, modify, and improve this project!

## 🐛 Bug Reports & Feature Requests

Create an issue on GitHub to report bugs or request features.

---

**Enjoy secure chatting from your terminal!** 🎉