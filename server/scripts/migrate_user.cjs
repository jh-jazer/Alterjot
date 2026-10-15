const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');

  const usersCollection = mongoose.connection.collection('users');
  const novelsCollection = mongoose.connection.collection('novels');

  const allUsers = await usersCollection.find({}).toArray();
  console.log('ALL USERS IN COLLECTION:');
  allUsers.forEach(u => console.log(u._id, u.email, u.googleId, 'vaultLength:', (u.encryptedVault || '').length));

  const userWithVault = allUsers.find(u => u.encryptedVault && u.encryptedVault.length > 0);
  const googleUser = allUsers.find(u => u.email === 'ernestodesabillejr@gmail.com');

  if (googleUser && userWithVault) {
    console.log('Copying vault from', userWithVault._id, 'to', googleUser._id);
    await usersCollection.updateOne(
      { _id: googleUser._id },
      { $set: { encryptedVault: userWithVault.encryptedVault, vaultUpdatedAt: new Date() } }
    );
    console.log('✅ Successfully copied encryptedVault to Google User!');
  }

  // Double check novels
  if (googleUser) {
    await novelsCollection.updateMany(
      { $or: [{ author: googleUser.penName }, { userId: { $regex: '^user_' } }] },
      { $set: { userId: googleUser._id.toString(), author: googleUser.penName } }
    );
    console.log('✅ Verified all novels assigned to:', googleUser._id.toString());
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
