// src/database/storage.js

/**
 * Initializes the database and manages file storage operations.
 */

const fs = require('fs');
const path = require('path');

/**
 * Initializes the database by creating necessary directories or files.
 * @param {string} dbPath - Path to the database.
 */
function initializeDatabase(dbPath) {
    if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
        console.log(`Database initialized at ${dbPath}`);
    } else {
        console.log(`Database already exists at ${dbPath}`);
    }
}

/**
 * Saves data to a file in the database.
 * @param {string} fileName - The name of the file to save data.
 * @param {string} data - The data to be saved.
 * @param {string} dbPath - Path to the database.
 */
function saveToFile(fileName, data, dbPath) {
    fs.writeFileSync(path.join(dbPath, fileName), data, 'utf8');
    console.log(`Data saved to ${fileName}`);
}

/**
 * Reads data from a file in the database.
 * @param {string} fileName - The name of the file to read data from.
 * @param {string} dbPath - Path to the database.
 * @returns {string} - The data read from the file.
 */
function readFromFile(fileName, dbPath) {
    const filePath = path.join(dbPath, fileName);
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
    } else {
        throw new Error(`File ${fileName} does not exist.`);
    }
}

module.exports = { initializeDatabase, saveToFile, readFromFile };