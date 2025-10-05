const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
async function connectDB(uri) {
  if (!uri) throw new Error('Missing MONGODB_URI');
  await mongoose.connect(uri, { autoIndex: true });
  console.log('[mongo] connected');
}
module.exports = { connectDB };
