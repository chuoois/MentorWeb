// tmp_make_admin.js - connect to MongoDB and set a user's role to ADMIN
const mongoose = require('mongoose');
(async ()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mentorweb');
    const User = require('./models/user.model');
    const email='test_admin@example.com';
    const u = await User.findOneAndUpdate({ email }, { role: 'ADMIN', status: 'ACTIVE' }, { new: true });
    console.log('updated', u? u.toObject() : null);
    process.exit(0);
  }catch(e){ console.error(e); process.exit(1);} 
})();
