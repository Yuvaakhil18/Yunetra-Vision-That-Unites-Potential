const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testVerificationAndBadges() {
    const PORT = 3000; // Update based on running NextJS server instance
    const BASE_URL = `http://localhost:${PORT}`;

    console.log('--- 1. Logging in as Learner (Priya) ---');
    let eveCookies = await getSessionCookies(BASE_URL, 'priya@demo.yunetra.in', 'Demo@1234');

    console.log('--- 2. Fetching React test questions ---');
    const getRoute = await fetch(`${BASE_URL}/api/verify/React`, {
        headers: { 'Cookie': eveCookies }
    });
    const questionsData = await getRoute.json();

    if (!questionsData.questions || questionsData.questions.length === 0) {
        console.log('Failed to fetch questions. Did you run the seed script?');
        return;
    }

    console.log(`Fetched ${questionsData.questions.length} questions. Example question: "${questionsData.questions[0].question}"`);

    console.log('\n--- 3. Testing Passing Score (4/5) ---');
    // Since we don't naturally know the answer, we will manually look at the mongodb data to fake it
    await mongoose.connect(process.env.MONGODB_URI);
    let correctAnswers = [];
    let wrongAnswers = [];

    for (const q of questionsData.questions) {
        const dbQ = await mongoose.connection.collection('questions').findOne({ _id: new mongoose.Types.ObjectId(q._id) });
        correctAnswers.push({ questionId: q._id, selectedOption: dbQ.correctAnswer });
        wrongAnswers.push({ questionId: q._id, selectedOption: dbQ.correctAnswer === 0 ? 1 : 0 });
    }

    // Pass 4 correct, 1 wrong
    let submission4 = [...correctAnswers.slice(0, 4), wrongAnswers[4]];

    const passRes = await fetch(`${BASE_URL}/api/verify/React/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': eveCookies },
        body: JSON.stringify({ answers: submission4 })
    });
    console.log('Pass Result:', passRes.status, await passRes.json());

    const updatedEve = await mongoose.connection.collection('users').findOne({ email: 'priya@demo.yunetra.in' });
    console.log(`Priya's Verified Skills:`, updatedEve.verifiedSkills);

    console.log('\n--- 4. Testing Failing Score (1/5) on Figma ---');
    const getFigma = await fetch(`${BASE_URL}/api/verify/Figma`, { headers: { 'Cookie': eveCookies } });
    const figmaQ = await getFigma.json();

    let figmaAnswers = [];
    for (const q of figmaQ.questions) {
        const dbQ = await mongoose.connection.collection('questions').findOne({ _id: new mongoose.Types.ObjectId(q._id) });
        figmaAnswers.push({ questionId: q._id, selectedOption: dbQ.correctAnswer === 0 ? 1 : 0 }); // ALL WRONG
    }

    // Make 1 correct
    const firstDbQ = await mongoose.connection.collection('questions').findOne({ _id: new mongoose.Types.ObjectId(figmaQ.questions[0]._id) });
    figmaAnswers[0].selectedOption = firstDbQ.correctAnswer;

    const failRes = await fetch(`${BASE_URL}/api/verify/Figma/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': eveCookies },
        body: JSON.stringify({ answers: figmaAnswers })
    });
    console.log('Fail Result:', failRes.status, await failRes.json());

    console.log('\n--- 5. Triggering 24hr Time Lock on Figma ---');
    const lockedRes = await fetch(`${BASE_URL}/api/verify/Figma`, { headers: { 'Cookie': eveCookies } });
    console.log('Lock Result:', lockedRes.status, await lockedRes.json());

    console.log('\n--- 6. Testing Badge Logic (Manually faking sessions for Arjun) ---');
    const bob = await mongoose.connection.collection('users').findOne({ email: 'arjun@demo.yunetra.in' });

    // Create 3 fake complete sessions for bob teaching React
    await mongoose.connection.collection('sessions').deleteMany({ skill: 'ReactMockTest' });
    await mongoose.connection.collection('sessions').insertMany([
        { teacherId: bob._id, learnerId: updatedEve._id, skill: 'ReactMockTest', status: 'completed' },
        { teacherId: bob._id, learnerId: updatedEve._id, skill: 'ReactMockTest', status: 'completed' },
        { teacherId: bob._id, learnerId: updatedEve._id, skill: 'ReactMockTest', status: 'completed' }
    ]);

    // The badge logic runs passively when completed. Since we force-inserted data, let's trigger it by just writing an API request manually
    await fetch(`${BASE_URL}/api/sessions/trigger-badges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: bob._id.toString() })
    });

    const curBob = await fetch(`${BASE_URL}/api/badges/${bob._id}`);
    console.log('Final Bob Badges API Result:', await curBob.json());

    await mongoose.disconnect();
}

async function getSessionCookies(baseUrl, email, password) {
    const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
    const csrfData = await csrfRes.json();

    let cookiesToKeep = [];
    cookiesToKeep.push(...csrfRes.headers.getSetCookie().map(c => c.split(';')[0]));

    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password); // Passwords are now Demo@1234 but email-specific call will handle it
    formData.append('csrfToken', csrfData.csrfToken);
    formData.append('json', 'true');

    const loginRes = await fetch(`${baseUrl}/api/auth/callback/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': cookiesToKeep.join('; ') },
        body: formData.toString()
    });

    cookiesToKeep.push(...loginRes.headers.getSetCookie().map(c => c.split(';')[0]));
    return cookiesToKeep.join('; ');
}

testVerificationAndBadges();
