/*document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('reset-password-form');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const newPassword = document.getElementById('new-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        messageDiv.textContent = ''; // Clear any previous messages

        // Basic password validation (ensure they match)
        if (newPassword !== confirmPassword) {
            messageDiv.textContent = 'Passwords do not match.';
            return;
        }

        try {
            // Assume we have a token in the URL for password reset
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            // Send a request to the server to reset the password
            const response = await fetch('http://172.16.2.6:4000/reset-password/:token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: token, newPassword: newPassword }),
            });

            if (response.ok) {
                messageDiv.textContent = 'Your password has been changed successfully!';
                messageDiv.style.color = 'green';
                form.reset();
            } else {
                const errorData = await response.json();
                messageDiv.textContent = `Error: ${errorData.message || 'Something went wrong.'}`;
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'An error occurred while resetting your password. Please try again later.';
        }
    });
});

// Function to toggle password visibility
function togglePasswordVisibility(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
}
*/
/*
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('new-password');
    const form = document.getElementById('confirm-password');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const newPassword = document.getElementById('new-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        messageDiv.textContent = ''; // Clear any previous messages

        // Basic password validation (ensure they match)
        if (newPassword.length === 0 || confirmPassword.length === 0) {
            messageDiv.textContent = 'Please enter both passwords.';
            messageDiv.style.color = 'red';
            return;
        }

        if (newPassword !== confirmPassword) {
            messageDiv.textContent = 'Passwords do not match.';
            messageDiv.style.color = 'red';
            return;
        }

        // Enhanced password validation
        const passwordValid = validatePassword(newPassword);

        if (!passwordValid) {
            messageDiv.textContent = 'Password must be at least 8 characters long, contain at least one number, one special character, and one uppercase letter.';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            // Assume we have a token in the URL for password reset
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            if (!token) {
                messageDiv.textContent = 'Invalid or missing reset token.';
                messageDiv.style.color = 'red';
                return;
            }

            // Send a request to the server to reset the password
            const response = await fetch(`http://your-api-url/reset-password/:token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enterPassword: newPassword }),
            });

            if (response.ok) {
                messageDiv.textContent = 'Your password has been changed successfully!';
                messageDiv.style.color = 'green';
                form.reset();
            } else {
                const errorData = await response.json();
                messageDiv.textContent = `Error: ${errorData.message || 'Something went wrong.'}`;
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'An error occurred while resetting your password. Please try again later.';
            messageDiv.style.color = 'red';
        }
    });
});

// Function to toggle password visibility
function passwordToggle(icon) {
    const input = icon.previousElementSibling; // Get the input field
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    icon.classList.toggle('bi-eye', type === 'password');
    icon.classList.toggle('bi-eye-slash', type === 'text');
}

// Function to validate password with length, character, special character, and number
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar;
}

// Initial setup to set the correct eye icon
document.querySelectorAll('.input-eye-icon').forEach(icon => {
    icon.classList.add('bi-eye'); // Default to eye icon
    icon.addEventListener('click', () => passwordToggle(icon));
});
*/
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('reset-password-form'); // Get the form element
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const newPassword = document.getElementById('new-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        messageDiv.textContent = ''; // Clear any previous messages

        // Basic password validation (ensure they match)
        if (newPassword.length === 0 || confirmPassword.length === 0) {
            messageDiv.textContent = 'Please enter both passwords.';
            messageDiv.style.color = 'red';
            return;
        }

        if (newPassword !== confirmPassword) {
            messageDiv.textContent = 'Passwords do not match.';
            messageDiv.style.color = 'red';
            return;
        }

        // Enhanced password validation
        const passwordValid = validatePassword(newPassword);

        if (!passwordValid) {
            messageDiv.textContent = 'Password must be at least 8 characters long, contain at least one number, one special character, and one uppercase letter.';
            messageDiv.style.color = 'red';
            return;
        }

        try {
            // Assume we have a token in the URL for password reset
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');

            if (!token) {
                messageDiv.textContent = 'Invalid or missing reset token.';
                messageDiv.style.color = 'red';
                return;
            }

            // Send a request to the server to reset the password
            const response = await fetch(`http://172.16.2.6:4000/reset-password/:token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enterPassword: newPassword }),
            });

            if (response.ok) {
                messageDiv.textContent = 'Your password has been changed successfully!';
                messageDiv.style.color = 'green';
                form.reset();
            } else {
                const errorData = await response.json();
                messageDiv.textContent = `Error: ${errorData.message || 'Something went wrong.'}`;
                messageDiv.style.color = 'red';
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'An error occurred while resetting your password. Please try again later.';
            messageDiv.style.color = 'red';
        }
    });
});

// Function to toggle password visibility
function passwordToggle(icon) {
    const input = icon.previousElementSibling; // Get the input field
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    icon.classList.toggle('bi-eye', type === 'password');
    icon.classList.toggle('bi-eye-slash', type === 'text');
}

// Function to validate password with length, character, special character, and number
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar;
}

// Initial setup to set the correct eye icon
document.querySelectorAll('.input-eye-icon').forEach(icon => {
    icon.classList.add('bi-eye'); // Default to eye icon
    icon.addEventListener('click', () => passwordToggle(icon));
});
