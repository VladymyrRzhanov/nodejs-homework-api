const mongoose = require('mongoose');
require('dotenv').config()

const uri = process.env.URI_DB;

const db = mongoose.connect(uri, {
    useNewUrlParser: true, useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Database connection successful');
});

mongoose.connection.on('error', (error) => {
    console.log(`Mongoose connection error: ${error.message}`);
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Connection to DB closed');
    process.exit();
});

module.exports = db;