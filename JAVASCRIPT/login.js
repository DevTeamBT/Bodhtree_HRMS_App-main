// async function loginUser(event) {
//     event.preventDefault();
//     const emailInput = document.getElementById('email');
//     const passwordInput = document.getElementById('password');
//     const officeEmail = emailInput.value.trim();
//     const enterPassword = passwordInput.value.trim();

//     // Email validation for @bodhtree.com
//     const emailPattern = /^[a-zA-Z0-9._%+-]+@bodhtree\.com$/; // Updated regex
//     if (!emailPattern.test(officeEmail)) {
//         showAlert('Invalid email format. Use a @bodhtree.com email.', 'danger');
//         emailInput.focus();
//         return;
//     }

//     // Password validation (minimum 8 characters, at least one number and one special character)
//     const passwordPattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
//     if (!passwordPattern.test(enterPassword)) {
//         showAlert('Password must be at least 8 characters long and include at least one number and one special character.', 'danger');
//         passwordInput.focus();
//         return;
//     }

//     try {
//         const response = await fetch('http://172.16.2.6:4000/api/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ officeEmail: officeEmail, enterPassword: enterPassword }),
//         });

//         if (response.ok) {
//             const result = await response.json();
//             showAlert('Login successful', 'success');
//             localStorage.setItem('loggedInUser', JSON.stringify(result.user));
//             window.location.href = ''; // Redirect after login
//         } else {
//             const errorResult = await response.json();
//             showAlert(errorResult.message || 'Invalid email or password', 'danger');
//         }
//     } catch (error) {
//         showAlert('An error occurred during login', 'danger');
//     }
// }

// // Function to display alerts
// function showAlert(message, type) {
//     const alertContainer = document.getElementById('alert-container');
//     alertContainer.innerHTML = `
//         <div class="alert alert-${type} alert-dismissible fade show" roleName="alert">
//             ${message}
//             <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//         </div>
//     `;
// }










async function loginUser(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email').value.trim();
    const passwordInput = document.getElementById('password').value.trim();

    // Ensure resultElement is defined at the start of the function
    const resultElement = document.getElementById('result'); 

    try {
        const response = await fetch('http://localhost:4000/api/login', {
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
                window.location.replace('/HTML/hr.html');
            } else if (userRole === 'employee') {
                window.location.replace('/HTML/home.html');
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
