// Function to display greeting
async function displayGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let timeGreeting;

    if (hours < 12) {
        timeGreeting = "Good Morning";
    } else if (hours < 18) {
        timeGreeting = "Good Afternoon";
    } else {
        timeGreeting = "Good Evening";
    }

    try {
        const response = await fetch('http://172.16.2.6:4000/api/users');
        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        const userRole = data.user?.roleName || 'Guest';
        const roleGreetings = {
            admin: 'Hello Admin',
            manager: 'Hello Manager',
            employee: 'Hello Employee',
            superadmin: 'Hello Superadmin',
            guest: 'Hello Guest'
        };
        const roleGreeting = roleGreetings[userRole] || 'Hello';
        document.getElementById('greeting').textContent = `${timeGreeting}, ${roleGreeting}, Welcome to Bodhtree!`;
    } catch (error) {
        console.error('Error fetching user details:', error);
        document.getElementById('greeting').textContent = `${timeGreeting}, Welcome to Bodhtree!`;
    }
}

// Function to display a random quote
function displayQuote() {
    const quotes = [
        "Strive not to be a success, but rather to be of value. – Albert Einstein",
        "The only limit to our realization of tomorrow is our doubts of today. – Franklin D. Roosevelt",
        "Life is what happens when you're busy making other plans. – John Lennon",
        "Success is not final, failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
        "The purpose of our lives is to be happy. – Dalai Lama"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote').textContent = randomQuote;
}

// Function to handle sign-in submission
function submitSignin() {
    const location = document.getElementById("location").value;
    
    if (location) {
        const now = new Date();
        const signinTimeElement = document.getElementById('signin-time');
        const messageElement = document.getElementById('message');
        const signoutBtn = document.getElementById('signout-btn');
        const swipesList = document.getElementById('swipes-list');

        signinTimeElement.textContent = `Signed in at: ${now.toLocaleTimeString()} (Location: ${location.replace('-', ' ')})`;
        messageElement.textContent = '';
        const li = document.createElement('li');
        li.textContent = `Signed in at: ${now.toLocaleTimeString()} (Location: ${location.replace('-', ' ')})`;
        swipesList.appendChild(li);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('locationModal'));
        modal.hide();

        signoutBtn.style.display = 'inline';
    } else {
        alert("Please choose a location.");
    }
}

// Function to show sign-out confirmation modal
function showSignoutConfirmation() {
    const modal = new bootstrap.Modal(document.getElementById('signoutConfirmationModal'));
    modal.show();
}

// Function to handle sign-out confirmation
function confirmSignout() {
    const now = new Date();
    const swipesList = document.getElementById('swipes-list');

    const li = document.createElement('li');
    li.textContent = `Signed out at: ${now.toLocaleTimeString()}`;
    swipesList.appendChild(li);

    // Hide the sign-out button
    const signoutBtn = document.getElementById('signout-btn');
    signoutBtn.style.display = 'none';

    // Hide the sign-out confirmation modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('signoutConfirmationModal'));
    modal.hide();

    // Optionally, you might want to clear the sign-in time or other session data here
    document.getElementById('signin-time').textContent = '';
    document.getElementById('message').textContent = '';
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayGreeting();
    displayQuote();
});


// fetching signIn and signOut api
//signIn
document.getElementById('signin-btn').addEventListener('click', async () => {
    const location = document.getElementById('location').value;
    const userId = sessionStorage.getItem('userId'); 
    const fullName = sessionStorage.getItem('fullName');

    // If no location is selected, alert and focus the select dropdown
    if (!location) {
        alert('Please select a location before signing in.');
        document.getElementById('location').focus(); // Focus on the location dropdown
        return;
    }

    if (!userId) {
        console.error('User ID is not available');
        alert('User ID not found. Please log in again.');
        return;
    }

    // Map the select option values to the server's expected status values
    const statusMap = {
        'wfh': 'workFromHome',
        'office': 'inOffice',
        'client-location': 'inClientLocation'
    };

    const status = statusMap[location] || 'Invalid Status';

    if (status === 'Invalid Status') {
        alert('Invalid location selected');
        console.log('Sign-in attempt failed: Invalid location');
        return;
    }

    console.log('Attempting to sign in:', { userId, status, fullName });

    try {
        const response = await fetch('http://localhost:4000/add/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                status
            })
        });

        // Log the full response for debugging
        const data = await response.json();
        console.log('Response Data:', data);

        if (response.ok) {
            document.getElementById('message').textContent = `Signed in successfully by ${fullName}`;
            console.log('Sign-in successful:', data);
            // Update UI or handle response
        } else {
            // Log the server response and error message
            document.getElementById('message').textContent = `Error: ${data.error || 'Unknown error'}`;
            console.error('Sign-in failed:', data);
        }
    } catch (error) {
        // Log the error details
        console.error('Sign-in request failed:', error);
        document.getElementById('message').textContent = 'An error occurred. Please try again.';
    }
});



//signOut
document.getElementById('signout-btn').addEventListener('click', async () => {
    const userId = sessionStorage.getItem('userId'); // Retrieve userId from sessionStorage

    if (!userId) {
        console.error('User ID is not available');
        alert('User ID not found. Please log in again.');
        return;
    }

    console.log('Attempting to sign out:', { userId });

    try {
        const response = await fetch('http://localhost:4000/add/signOut', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('message').textContent = 'Signed out successfully';
            console.log('Sign-out successful:', data);
            // Update UI or handle response
        } else {
            document.getElementById('message').textContent = `Error: ${data.error}`;
            console.log('Sign-out failed:', data.error);
        }
    } catch (error) {
        console.error('Sign-out request failed:', error);
        document.getElementById('message').textContent = 'An error occurred. Please try again.';
    }
});
