const mongoose = require ('mongoose');
require('dotenv').config();

const db  = mongoose.connect(process.env.DB, {

})
    .then(()=> console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

module.exports = db;