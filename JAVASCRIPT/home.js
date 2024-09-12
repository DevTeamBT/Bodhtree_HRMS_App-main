async function displayGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let timeGreeting;

    // Determine time-based greeting
    if (hours < 12) {
        timeGreeting = "Good Morning";
    } else if (hours < 18) {
        timeGreeting = "Good Afternoon";
    } else {
        timeGreeting = "Good Evening";
    }

    try {
        // Fetch the user's details from the backend API
       const response = await fetch('http://172.16.2.6:4000/api/users');
            if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }
        const data = await response.json();

        // Extract the role from the response data
        const userRole = data.user?.roleName; // Adjust this according to your API's response structure

        // Define greetings based on roles
        const roleGreetings = {
            admin: 'Hello Admin',
            manager: 'Hello Manager',
            employee: 'Hello Employee',
            superadmin: 'Hello Superadmin',
            guest: 'Hello Guest'
        };

        // Validate the role and get the greeting message
        const roleGreeting = roleGreetings[userRole] || 'Hello';

        // Combine time-based and role-based greetings
        document.getElementById('greeting').textContent = `${timeGreeting}, ${roleGreeting}, Welcome to Bodhtree!`;

    } catch (error) {
        console.error('Error fetching user details:', error);
        document.getElementById('greeting').textContent = `${timeGreeting}, Guest, Welcome to Bodhtree!`;
    }
}

// Function to display a random quote
function displayQuote() {
    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer",
        "Hard work beats talent when talent doesn’t work hard. - Tim Notke",
        "Don’t watch the clock; do what it does. Keep going. - Sam Levenson",
        "Believe you can and you’re halfway there. - Theodore Roosevelt"
    ];

    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quote').textContent = `Quote of the day: "${quotes[randomIndex]}"`;
}

// Call the functions when the page loads
window.onload = function() {
    displayGreeting();
    displayQuote();
};

/*
async function fetchUserName() {
    try {
        // Replace this with your actual API endpoint to fetch the user's full name
        const response = await fetch('http://172.16.2.6:4000/api/users');
        if (!response.ok) {
            throw new Error('Failed to fetch name');
        }
        const data = await response.json();
        return data.fullName; // Use fullName as the key
    } catch (error) {
        console.error('Error fetching name:', error);
        return 'Guest'; // Fallback to "Guest" if there's an error
    }
}

// Function to display the greeting with the user's name
async function displayGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let timeGreeting;

    // Determine time-based greeting
    if (hours < 12) {
        timeGreeting = "Good Morning";
    } else if (hours < 18) {
        timeGreeting = "Good Afternoon";
    } else {
        timeGreeting = "Good Evening";
    }

    // Fetch the user's name
    const userName = await fetchUserName(); // Corrected function name

    // Combine time-based greeting with user's name
    document.getElementById('greeting').textContent = `${timeGreeting}, ${userName}, welcome to Bodhtree!`;
}

// Function to display a random quote
function displayQuote() {
    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Success is not the key to happiness. Happiness is the key to success. - Albert Schweitzer",
        "Hard work beats talent when talent doesn’t work hard. - Tim Notke",
        "Don’t watch the clock; do what it does. Keep going. - Sam Levenson",
        "Believe you can and you’re halfway there. - Theodore Roosevelt"
    ];

    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById('quote').textContent = `Quote of the day: "${quotes[randomIndex]}"`;
}

// Call the functions when the page loads
window.onload = function() {
    displayGreeting();
    displayQuote();
};
*/