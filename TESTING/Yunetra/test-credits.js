const mongoose = require('mongoose');

async function testCreditsAPI() {
    const PORT = 3000;
    const BASE_URL = `http://localhost:${PORT}`;

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

    console.log('\n--- 1. Checking Initial Balance ---');
    const balRes1 = await fetch(`${BASE_URL}/api/credits/balance`, {
        headers: { 'Cookie': finalCookieStr }
    });
    const balData1 = await balRes1.json();
    console.log('Balance:', balData1.balance);
    console.log('History length:', balData1.history.length);


    console.log('\n--- 2. Spending 1 Credit Successfully ---');
    const spendRes1 = await fetch(`${BASE_URL}/api/credits/spend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': finalCookieStr
        },
        body: JSON.stringify({ amount: 1, description: 'Booked a React tutoring session' })
    });
    const spendData1 = await spendRes1.json();
    console.log('Spend Status:', spendRes1.status);
    console.log('Message:', spendData1.message);

    console.log('\n--- 3. Overspending (Should fail) ---');
    const spendRes2 = await fetch(`${BASE_URL}/api/credits/spend`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': finalCookieStr
        },
        body: JSON.stringify({ amount: 10, description: 'Trying to buy a lambo' })
    });
    const spendData2 = await spendRes2.json();
    console.log('Spend Status:', spendRes2.status);
    console.log('Message:', spendData2.message);

    console.log('\n--- 4. Verifying Final Balance & History ---');
    const balRes2 = await fetch(`${BASE_URL}/api/credits/balance`, {
        headers: { 'Cookie': finalCookieStr }
    });
    const balData2 = await balRes2.json();

    console.log('Final Balance (should be previous - 1):', balData2.balance);
    console.log('History (newest first):');
    balData2.history.forEach((tx) => {
        console.log(` - [${tx.type.toUpperCase()}] ${tx.amount} credits: ${tx.description}`);
    });
}

testCreditsAPI();
