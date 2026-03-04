async function testProfileAPI() {
    const PORT = 3000;
    const BASE_URL = `http://localhost:${PORT}`;

    console.log('--- Testing Unauthorized Access ---');

    const meRes401 = await fetch(`${BASE_URL}/api/profile/me`);
    console.log('GET /api/profile/me (No Auth) Status:', meRes401.status);

    const updateRes401 = await fetch(`${BASE_URL}/api/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ college: 'MIT' })
    });
    console.log('PUT /api/profile/update (No Auth) Status:', updateRes401.status);

    console.log('\n--- Logging in to get session cookie ---');
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

    const loginData = await loginRes.json();
    const sessionCookies = loginRes.headers.getSetCookie();
    cookiesToKeep.push(...sessionCookies.map(c => c.split(';')[0]));
    const finalCookieStr = cookiesToKeep.join('; ');

    console.log('Login Status:', loginRes.status);
    console.log('Login Result:', loginData);

    console.log('\n--- Testing Authenticated Routes ---');
    const meRes = await fetch(`${BASE_URL}/api/profile/me`, {
        headers: { 'Cookie': finalCookieStr }
    });
    const meData = await meRes.json();
    console.log('GET /api/profile/me Status:', meRes.status);
    console.log('GET /api/profile/me Data:', { name: meData.name, email: meData.email });

    if (!meData._id) {
        console.error('Failed to get user ID! Aborting.');
        return;
    }
    const userId = meData._id;

    console.log('\nUpdating profile...');
    const updateRes = await fetch(`${BASE_URL}/api/profile/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': finalCookieStr
        },
        body: JSON.stringify({
            skillsTeach: ['React', 'Next.js'],
            skillsLearn: ['MongoDB', 'GraphQL']
        })
    });
    const updateData = await updateRes.json();
    console.log('PUT /api/profile/update Status:', updateRes.status);
    if (updateData.user) {
        console.log('Updated Skills Teach:', updateData.user.skillsTeach);
        console.log('Updated Skills Learn:', updateData.user.skillsLearn);
    }

    console.log(`\nFetching public profile for ID: ${userId}...`);
    const idRes = await fetch(`${BASE_URL}/api/profile/${userId}`);
    const idData = await idRes.json();
    console.log(`GET /api/profile/[userId] Status:`, idRes.status);
    console.log('Public Profile Data:', { name: idData.name, skillsTeach: idData.skillsTeach });
}

testProfileAPI();
