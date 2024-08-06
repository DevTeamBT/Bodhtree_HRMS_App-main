document.addEventListener('DOMContentLoaded', function () {
    // Get the form element
    const form = document.querySelector('form');

    // Add an event listener for form submission
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the email value and trim any extra whitespace
        const email = document.getElementById("email").value.trim();

        //console.log(email);
        
        // Basic email format validation using a regex pattern
        const emailPattern = /^[a-zA-Z0-9._%+-]+@bodhtree\.com$/;

        if (!email) {
            alert('Please enter your email address.');
            return;
        } else if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            // Send a request to the server to send a password reset link
            const response = await fetch('http://172.16.2.6:4000/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ officeEmail: email }),
            });

            //console.log(response);
            
            if (response.ok) {
                // Display a success message if the request was successful
                alert('Instructions to reset your password have been sent to your email address.');
            } else {
                // Handle server-side errors
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Something went wrong.'}`);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error:', error);
            alert('An error occurred while sending the password reset link. Please try again later.');
        }

        // Optionally, clear the form
        form.reset();
  
    });
});
