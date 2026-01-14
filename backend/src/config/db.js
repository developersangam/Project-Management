const mongoose = require('mongoose');

async function connectDB(uri) {
  const mongoURI = uri || process.env.MONGODB_URI || 'mongodb://localhost:27017/project_management';
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
}

module.exports = connectDB;
