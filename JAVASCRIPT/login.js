// Function to send a POST request to the API
async function loginUser(event) {
    event.preventDefault();
    const officeEmail = document.getElementById('email').value;
    const enterPassword = document.getElementById('password').value;

    try {
        const response = await fetch('http://172.16.2.6:4000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ officeEmail: officeEmail, enterPassword: enterPassword }),
        });

        if (response.ok) {
            const result = await response.json();
            // const userName = result.user.fullName;
            // const fullName = localStorage.getItem('fullName');

            document.getElementById('result').innerText = 'Login successful';

            // Store user information in localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(result.user));
            // const userRole = result.user.role;

            // Redirect based on the user's role
            // if (userRole === 'admin') {
                console.log('Redirecting to /dashboard');
                window.location.replace('/HTML/home.html');
            // } else if (userRole === 'employee') {
            //     console.log('Redirecting to /index');
            //     window.location.replace('/home');
            // } else {
            //     console.error('Invalid role:', userRole);
            //     document.getElementById('result').innerText = 'Invalid role';
            // }
        } else {
            const errorResult = await response.json();
            console.error('Login failed:', errorResult.message);
            document.getElementById('result').innerText = 'Invalid email or password';
        }
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('result').innerText = 'An error occurred during login';
    }
}
