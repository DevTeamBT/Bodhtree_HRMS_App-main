document.getElementById('clientForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
  
    // Function to fetch form data values
    function getFormData() {
        return {
            companyname: document.getElementById('companyname').value,
            url: document.getElementById('url').value,
            address1: document.getElementById('address1').value,
            address2: document.getElementById('address2').value,
            countryID: document.getElementById('countryDropdown').value,
            stateID: document.getElementById('stateDropdown').value,
            cityID: document.getElementById('cityDropdown').value,
            zip: document.getElementById('zip').value,
            industry: document.getElementById('industry').value,
            companySize: document.querySelector('select[name="Company_Size"]').value,
            linkedin: document.getElementById('linkedin').value,
            networth: document.getElementById('networth').value
        };
    }
  
    // Function to send JSON data to the /company API
    async function postCompanyData() {
        const {
            companyname,
            url,
            address1,
            address2,
            countryID,
            stateID,
            cityID,
            zip,
            industry,
            companySize,
            linkedin,
            networth
        } = getFormData();

        try {
            // Fetch data for countryID, stateID, and cityID
            const [countryResponse, stateResponse, cityResponse] = await Promise.all([
                fetch(`http://172.16.2.6:4000/countries/${countryID}`),
                fetch(`http://172.16.2.6:4000/states/${stateID}`),
                fetch(`http://172.16.2.6:4000/cities/${cityID}`)
            ]);

            if (!countryResponse.ok) {
                throw new Error('Error fetching country data');
            }
            if (!stateResponse.ok) {
                throw new Error('Error fetching state data');
            }
            if (!cityResponse.ok) {
                throw new Error('Error fetching city data');
            }

            const [countryData, stateData, cityData] = await Promise.all([
                countryResponse.json(),
                stateResponse.json(),
                cityResponse.json()
            ]);

            // Define the JSON data to be sent
            const data = {
                companyName: companyname,
                url: url,
                address1: address1,
                address2: address2,
                countryID: countryID,
                stateID: stateID,
                cityID: cityID,
                zip: zip,
                industry: industry,
                companySize: companySize,
                linkedIn: linkedin,
                networth: networth,
                countryData: countryData,
                stateData: stateData,
                cityData: cityData
            };

            // Send POST request
            const response = await fetch('http://172.16.2.6:4000/company', {
                method: 'POST', // Specify the method
                headers: {
                    'Content-Type': 'application/json' // Specify the content type
                },
                body: JSON.stringify(data) // Convert data to JSON
            });

            // Handle response
            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }
  
    // Call the function
    postCompanyData();
});
