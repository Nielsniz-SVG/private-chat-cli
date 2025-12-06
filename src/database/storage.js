const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../..', 'data');

// Ensure data directory exists
const ensureDataDirectory = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// File paths
const getFilePath = (filename) => path.join(DATA_DIR, `${filename}.json`);

// Initialize file if it doesn't exist
const initializeFile = (filename, defaultData = []) => {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

// Read data from file
const readData = (filename) => {
  initializeFile(filename);
  const filePath = getFilePath(filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Write data to file
const writeData = (filename, data) => {
  ensureDataDirectory();
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Add data to file
const addData = (filename, newData) => {
  const data = readData(filename);
  data.push(newData);
  writeData(filename, data);
};

// Update data in file
const updateData = (filename, id, updatedData) => {
  const data = readData(filename);
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...updatedData };
    writeData(filename, data);
    return true;
  }
  return false;
};

// Find data in file
const findData = (filename, condition) => {
  const data = readData(filename);
  return data.find(condition);
};

// Filter data in file
const filterData = (filename, condition) => {
  const data = readData(filename);
  return data.filter(condition);
};

// Generate unique ID
const generateId = () => crypto.randomBytes(16).toString('hex');

module.exports = {
  ensureDataDirectory,
  readData,
  writeData,
  addData,
  updateData,
  findData,
  filterData,
  generateId,
  getFilePath
};