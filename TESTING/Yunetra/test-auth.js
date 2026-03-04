async function testAuth() {
    try {
        console.log('Testing /api/auth/register...');
        const res = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Indian Student',
                email: 'student' + Date.now() + '@example.com',
                password: 'password123',
                college: 'IIT Delhi',
                year: '3rd',
                branch: 'Computer Science'
            })
        });

        const text = await res.text();
        console.log('Register Status:', res.status);
        console.log('Register Response:', text);

        console.log('\nTesting NextAuth credentials signin...');

        const csrfRes = await fetch('http://localhost:3000/api/auth/csrf');
        const csrfData = await csrfRes.json();

        const formData = new URLSearchParams();
        formData.append('email', 'student@example.com');
        formData.append('password', 'password123');
        // NextAuth v4 needs lowercase csrfToken parameter
        formData.append('csrfToken', csrfData.csrfToken);
        formData.append('json', 'true');

        const loginRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': csrfRes.headers.get('set-cookie') || ''
            },
            body: formData.toString()
        });

        const loginText = await loginRes.text();
        console.log('Login Status:', loginRes.status);
        console.log('Login Response:', loginText);
    } catch (error) {
        console.error('Test Auth Error:', error);
    }
}

testAuth();
