const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function checkDB() {
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to:', uri);
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        console.log('Successfully connected to MongoDB!');

        // Let's check if there are users
        const db = mongoose.connection.db;
        const users = await db.collection('users').find({}).limit(1).toArray();
        console.log('Found users in DB:', users.length);
        if (users.length > 0) {
            console.log('Sample user:', users[0].email);
            console.log('_id type:', typeof users[0]._id, users[0]._id.toString());
        }

    } catch (err) {
        console.error('Failed to connect or query:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkDB();
