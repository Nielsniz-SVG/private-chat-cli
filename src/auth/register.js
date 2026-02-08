const fs = require('fs');
const crypto = require('crypto');

const usersFile = 'users.json';

// Helper function to generate a unique verification code
const generateVerificationCode = () => {
    return crypto.randomBytes(16).toString('hex');
};

// Helper function to hash the password
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// Helper function to read users data
const readUsers = () => {
    if (!fs.existsSync(usersFile)) {
        return [];
    }
    const data = fs.readFileSync(usersFile);
    return JSON.parse(data);
};

// Helper function to save users data
const saveUsers = (users) => {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
};

const registerUser = (username, email, password) => {
    const users = readUsers();

    // Validate email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
    }

    // Check username uniqueness
    if (users.some(user => user.username === username)) {
        throw new Error('Username already taken');
    }

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // New user data
    const newUser = { username, email, hashedPassword, verificationCode, verified: false };

    // Save new user to file
    users.push(newUser);
    saveUsers(users);

    // Simulate sending verification email
    console.log(`Verification email sent to ${email} with code: ${verificationCode}`);
};

// Example usage (to be replaced with actual input handling)
try {
    registerUser('testuser', 'test@example.com', 'securepassword123');
    console.log('User registered successfully');
} catch (error) {
    console.error(error.message);
}
