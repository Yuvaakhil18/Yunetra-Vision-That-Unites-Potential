const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testSessionsLifecycle() {
    const PORT = 3000;
    const BASE_URL = `http://localhost:${PORT}`;

    console.log('--- 1. Logging in as Learner (Priya) ---');
    let eveCookies = await getSessionCookies(BASE_URL, 'priya@demo.yunetra.in', 'Demo@1234');

    console.log('--- 2. Logging in as Teacher (Arjun) ---');
    let bobCookies = await getSessionCookies(BASE_URL, 'arjun@demo.yunetra.in', 'Demo@1234');

    // We need Arjun's ID
    await mongoose.connect(process.env.MONGODB_URI);
    const bob = await mongoose.connection.collection('users').findOne({ email: 'arjun@demo.yunetra.in' });
    const bobId = bob._id.toString();

    // Print initial balances
    console.log('\n--- Initial Balances ---');
    const initialEveBal = await fetchBalance(BASE_URL, eveCookies);
    const initialBobBal = await fetchBalance(BASE_URL, bobCookies);
    console.log(`Eve (Learner): ${initialEveBal}`);
    console.log(`Bob (Teacher): ${initialBobBal}`);

    console.log('\n--- 3. Learner Creates Session ---');
    const createRes = await fetch(`${BASE_URL}/api/sessions/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': eveCookies },
        body: JSON.stringify({
            teacherId: bobId,
            skill: 'React',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            duration: 60,
            learnerLevel: 'Beginner',
            learnerGoal: 'Understand hooks'
        })
    });
    const createData = await createRes.json();
    console.log('Create Response:', createRes.status, createData.message);
    const sessionId = createData.session._id;

    console.log('\n--- Post-Create Balances ---');
    console.log(`Eve (Learner) Balance: ${await fetchBalance(BASE_URL, eveCookies)}`);

    console.log('\n--- 4. Teacher Confirms Session ---');
    const confirmRes = await fetch(`${BASE_URL}/api/sessions/${sessionId}/confirm`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Cookie': bobCookies },
        body: JSON.stringify({
            teacherOutline: ['Setting up vite', 'useState', 'useEffect'],
            meetLink: 'https://meet.google.com/abc-defg-hij'
        })
    });
    const confirmData = await confirmRes.json();
    console.log('Confirm Response:', confirmRes.status, confirmData.message);

    console.log('\n--- 5. Session Starts ---');
    const startRes = await fetch(`${BASE_URL}/api/sessions/${sessionId}/start`, {
        method: 'PUT',
        headers: { 'Cookie': bobCookies } // Either can start, bob does it here
    });
    console.log('Start Response:', startRes.status, (await startRes.json()).message);

    console.log('\n--- 6. Learner Completes Session ---');
    const lCompRes = await fetch(`${BASE_URL}/api/sessions/${sessionId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Cookie': eveCookies },
        body: JSON.stringify({ rating: 5, review: 'Great intro to React!', confirmedBy: 'learner' })
    });
    console.log('Learner Complete Response:', lCompRes.status, (await lCompRes.json()).message);

    console.log('\n--- 7. Teacher Completes Session ---');
    const tCompRes = await fetch(`${BASE_URL}/api/sessions/${sessionId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Cookie': bobCookies },
        body: JSON.stringify({ rating: 4, review: 'Good student, grasped concepts fast.', confirmedBy: 'teacher' })
    });
    const tCompResTxt = await tCompRes.text();
    console.log('Teacher Complete Response:', tCompRes.status, tCompResTxt);

    console.log('\n--- Post-Completion Balances ---');
    console.log(`Bob (Teacher) Balance: ${await fetchBalance(BASE_URL, bobCookies)}`);

    const updatedBob = await mongoose.connection.collection('users').findOne({ email: 'arjun@demo.yunetra.in' });
    console.log(`Arjun's New Rating: ${updatedBob.rating} | Total Sessions: ${updatedBob.totalSessions}`);


    console.log('\n--- 8. Testing Dispute Flow ---');
    // Create another session
    const dispCreateRes = await fetch(`${BASE_URL}/api/sessions/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Cookie': eveCookies },
        body: JSON.stringify({
            teacherId: bobId,
            skill: 'NextJS',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        })
    });
    const dispCreateData = await dispCreateRes.json();
    const disputeSessionId = dispCreateData.session._id;

    console.log(`Eve Balance AFTER creating dispute session: ${await fetchBalance(BASE_URL, eveCookies)}`);

    // Dispute it
    const dispRes = await fetch(`${BASE_URL}/api/sessions/${disputeSessionId}/dispute`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Cookie': eveCookies },
        body: JSON.stringify({ reason: 'Teacher never showed up to the meeting and ghosted me.' })
    });
    console.log('Dispute Response:', dispRes.status, (await dispRes.json()).message);

    console.log(`Eve Balance AFTER refund: ${await fetchBalance(BASE_URL, eveCookies)}`);

    await mongoose.disconnect();
}

// Helpers
async function getSessionCookies(baseUrl, email, password) {
    const csrfRes = await fetch(`${baseUrl}/api/auth/csrf`);
    const csrfData = await csrfRes.json();

    let cookiesToKeep = [];
    cookiesToKeep.push(...csrfRes.headers.getSetCookie().map(c => c.split(';')[0]));

    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);
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

async function fetchBalance(baseUrl, cookieHeader) {
    const res = await fetch(`${baseUrl}/api/credits/balance`, { headers: { 'Cookie': cookieHeader } });
    const data = await res.json();
    return data.balance;
}

testSessionsLifecycle();
