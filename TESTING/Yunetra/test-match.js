const mongoose = require('mongoose');

async function testMatchingAPI() {
    const PORT = 3000;
    const BASE_URL = `http://localhost:${PORT}`;

    console.log('--- Seeding Test Users ---');
    // First, we create 5 dummy users to test the matching algorithm
    // User A (Student - React/NextJS) is already created from previous tests. Let's add B, C, D, E.

    const seedUsers = [
        {
            name: 'Bob the Builder',
            email: 'bob@example.com',
            password: 'password123',
            college: 'IIT Delhi',
            year: '4th',
            branch: 'Civil'
        },
        {
            name: 'Charlie AI',
            email: 'charlie@example.com',
            password: 'password123',
            college: 'NIT Trichy',
            year: '3rd',
            branch: 'Electrical'
        },
        {
            name: 'Diana Design',
            email: 'diana@example.com',
            password: 'password123',
            college: 'IIT Delhi',
            year: '2nd',
            branch: 'Design'
        },
        {
            name: 'Eve Express',
            email: 'eve@example.com',
            password: 'password123',
            college: 'BITS Pilani',
            year: '1st',
            branch: 'Computer Science'
        }
    ];

    for (const user of seedUsers) {
        const res = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        console.log(`Registered ${user.name}:`, res.status);
    }

    // --- Seed their skills directly via Mongo for simplicity in this script ---
    require('dotenv').config({ path: '.env.local' });
    await mongoose.connect(process.env.MONGODB_URI);

    // Bob wants React, knows MongoDB
    await mongoose.connection.collection('users').updateOne(
        { email: 'bob@example.com' },
        {
            $set: {
                skillsTeach: ['MongoDB', 'Civil Engineering'],
                skillsLearn: ['React', 'Next.js'],
                rating: 4.8,
                totalSessions: 12
            }
        }
    );

    // Charlie knows GraphQL (which Test User wants), wants Python
    await mongoose.connection.collection('users').updateOne(
        { email: 'charlie@example.com' },
        {
            $set: {
                skillsTeach: ['GraphQL', 'Python'],
                skillsLearn: ['Machine Learning'],
                rating: 3.5,
                totalSessions: 5
            }
        }
    );

    // Diana knows Figma, wants React. Same college as Test User.
    await mongoose.connection.collection('users').updateOne(
        { email: 'diana@example.com' },
        {
            $set: {
                skillsTeach: ['Figma', 'UI/UX'],
                skillsLearn: ['React'],
                rating: 0,
                totalSessions: 0
            }
        }
    );

    // Eve knows nothing Test User wants, wants nothing Test User knows.
    await mongoose.connection.collection('users').updateOne(
        { email: 'eve@example.com' },
        {
            $set: {
                skillsTeach: ['Java', 'Spring'],
                skillsLearn: ['C++', 'Rust'],
                rating: 4.0,
                totalSessions: 8
            }
        }
    );

    console.log('\n--- Logging in as Test Student ---');
    const csrfRes = await fetch(`${BASE_URL}/api/auth/csrf`);
    const csrfData = await csrfRes.json();

    let cookiesToKeep = [];
    const initialCookies = csrfRes.headers.getSetCookie();
    cookiesToKeep.push(...initialCookies.map(c => c.split(';')[0]));

    const formData = new URLSearchParams();
    formData.append('email', 'arjun@demo.yunetra.in');
    formData.append('password', 'Demo@1234');
    formData.append('csrfToken', csrfData.csrfToken);
    formData.append('json', 'true');

    const loginRes = await fetch(`${BASE_URL}/api/auth/callback/credentials`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookiesToKeep.join('; ')
        },
        body: formData.toString()
    });

    const sessionCookies = loginRes.headers.getSetCookie();
    cookiesToKeep.push(...sessionCookies.map(c => c.split(';')[0]));
    const finalCookieStr = cookiesToKeep.join('; ');

    console.log('Login Status:', loginRes.status);

    console.log('\n--- Testing Match API ---');
    const matchRes = await fetch(`${BASE_URL}/api/match`, {
        headers: { 'Cookie': finalCookieStr }
    });
    const matchData = await matchRes.json();

    console.log('GET /api/match Status:', matchRes.status);
    console.log('\n--- MATCH RESULTS ---');
    if (matchData.matches && matchData.matches.length > 0) {
        matchData.matches.forEach((match, i) => {
            console.log(`\n#${i + 1}: ${match.name} (Score: ${match.compatibilityScore})`);
            console.log(`   Reasons:`, match.matchReasons);
            console.log(`   Teaches: ${match.skillsTeach.join(', ')}`);
            console.log(`   Wants to Learn: ${match.skillsLearn.join(', ')}`);
        });
    } else {
        console.log('No matches found > 20 points.');
    }

    await mongoose.disconnect();
}

testMatchingAPI();
