const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const User = require('../backend/models/User');
const Profile = require('../backend/models/Profile');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const users = await User.find();
  const profiles = await Profile.find();

  console.log('USERS:');
  users.forEach(u => console.log(`- ${u.username} (${u._id})`));

  console.log('\nPROFILES:');
  profiles.forEach(p => console.log(`- Name: ${p.name}, userId: ${p.userId}`));

  await mongoose.disconnect();
}

check();
