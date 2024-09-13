
async function loginUser(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    // Ensure resultElement is defined at the start of the function
    const resultElement = document.getElementById('result'); 

    try {
        const response = await fetch('http://172.16.2.6:4000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ officeEmail: emailInput, enterPassword: passwordInput }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('API Response:', result);

            if (!result.user || !result.user.roleName) {
                console.error('Login response does not contain user or role');
                resultElement.innerText = 'Login failed: invalid response format.';
                return;
            }

            // Successful login
            resultElement.innerText = 'Login successful';
            localStorage.setItem('loggedInUser', JSON.stringify(result.user));

            const userRole = result.user.roleName;
            if (userRole === 'admin') {
                window.location.replace('/HTML/HrPages/hr.html');
            } else if (userRole === 'employee') {
                window.location.replace('/HTML/employeePages/home.html');
            } else if (userRole === 'manager') {
                window.location.replace('/HTML/managerPages/managerHome.html');
            } else {
                resultElement.innerText = 'Invalid role';
            }
        } else {
            const errorText = await response.text(); // Read response as plain text
            console.error('Login failed:', errorText);
            resultElement.innerText = 'Invalid email or password';
        }
    } catch (error) {
        console.error('Error during login:', error);
        resultElement.innerText = 'An error occurred during login. Please try again later.';
    }
}
