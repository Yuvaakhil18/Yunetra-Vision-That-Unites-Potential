const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function verifySeeding() {
    const uri = process.env.MONGODB_URI;
    console.log('Verifying data in:', uri.split('@')[1] || uri);
    try {
        await mongoose.connect(uri);
        console.log('Connected!');

        const db = mongoose.connection.db;

        const userCount = await db.collection('users').countDocuments();
        const arenaCount = await db.collection('arenachallenges').countDocuments();
        const resourceCount = await db.collection('resources').countDocuments();
        const sessionCount = await db.collection('sessions').countDocuments();

        console.log('--- DATABASE SUMMARY ---');
        console.log('Users:', userCount);
        console.log('Arena Challenges:', arenaCount);
        console.log('Resources:', resourceCount);
        console.log('Sessions:', sessionCount);
        console.log('------------------------');

    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

verifySeeding();
