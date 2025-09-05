const mongoose = require ('mongoose');
require('dotenv').config();

const db  = mongoose.connect(process.env.DB);

module.exports = db;