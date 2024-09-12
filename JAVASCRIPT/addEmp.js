document.addEventListener('DOMContentLoaded', function () {
    const url = window.location.pathname; // Get the current page path

    // Populate form fields with saved data
    function populateForm(storageKey, fieldIds) {
        const data = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
        fieldIds.forEach(id => {
            const element = document.getElementById(id);
            if (element && data[id]) {
                element.value = data[id];
            }
        });
    }

    if (url.includes('step1.html')) {
        populateForm('step1Data', ['empSeries', 'probation', 'employeeNumber', 'conformationdate', 'fullname', 'persionalemail', 'dob', 'pnumber', 'gender', 'role', 'status', 'doj']);

        const nextButton1 = document.getElementById('next1');
        if (nextButton1) {
            nextButton1.addEventListener('click', () => {
                const step1Data = {
                    enterseries: document.getElementById('empSeries')?.value || '',
                    probationPeriod: document.getElementById('probation')?.value || '',
                    enterCode: document.getElementById('employeeNumber')?.value || '',
                    confirmationDate: document.getElementById('conformationdate')?.value || '',
                    fullName: document.getElementById('fullname')?.value || '',
                    personal_Email: document.getElementById('persionalemail')?.value || '',
                    dateOfBirth: document.getElementById('dob')?.value || '',
                    mobileNo: document.getElementById('pnumber')?.value || '',
                    gender: document.getElementById('gender')?.value || '',
                    roleName: document.getElementById('role')?.value || '',
                    status: document.getElementById('status')?.value || '',
                    dateOfJoining: document.getElementById('doj')?.value || ''
                };
                sessionStorage.setItem('step1Data', JSON.stringify(step1Data));
                window.location.href = 'step2.html'; // Navigate to step 2
            });
        }
    } else if (url.includes('step2.html')) {
        populateForm('step2Data', ['bloodGroup', 'physicalChallenged', 'nationality', 'martialStatus', 'spouseName', 'currentAddress', 'fName', 'ecn', 'emcn']);

        const nextButton2 = document.getElementById('next2');
        if (nextButton2) {
            nextButton2.addEventListener('click', () => {
                const step2Data = {
                    bloodGroup: document.getElementById('bloodGroup')?.value || '',
                    physicalChallenged: document.getElementById('physicalChallenged')?.value || '',
                    nationality: document.getElementById('nationality')?.value || '',
                    maritalStatus: document.getElementById('martialStatus')?.value || '',
                    spouseName: document.getElementById('spouseName')?.value || '',
                    address: document.getElementById('currentAddress')?.value || '',
                    fathersName: document.getElementById('fName')?.value || '',
                    emergencyContactNumber: document.getElementById('ecn')?.value || '',
                    emergencyContactName: document.getElementById('emcn')?.value || ''
                };
                sessionStorage.setItem('step2Data', JSON.stringify(step2Data));
                window.location.href = 'step3.html'; // Navigate to step 3
            });
        }
    } else if (url.includes('step3.html')) {
        populateForm('step3Data', ['aadhaarNumber', 'pn', 'pfno', 'uan', 'accNumber', 'ifscNumber']);

        const nextButton3 = document.getElementById('next3');
        if (nextButton3) {
            nextButton3.addEventListener('click', () => {
                const step3Data = {
                    aadhaarNumber: document.getElementById('aadhaarNumber')?.value || '',
                    panNumber: document.getElementById('pn')?.value || '',
                    pfNumber: document.getElementById('pfno')?.value || '',
                    uanNumber: document.getElementById('uan')?.value || '',
                    bankAccountNumber: document.getElementById('accNumber')?.value || '',
                    bankIfscCode: document.getElementById('ifscNumber')?.value || ''
                };
                sessionStorage.setItem('step3Data', JSON.stringify(step3Data));
                window.location.href = 'step4.html'; // Navigate to step 4
            });
        }
    } else if (url.includes('step4.html')) {
        populateForm('step4Data', ['grade', 'designation', 'department', 'loc', 'shift', 'hCat', 'company', 'salary', 'officemail', 'mpass', 'reportingmanager', 'startTime', 'endTime']);

        const submitButton = document.getElementById('submit');
        if (submitButton) {
            submitButton.addEventListener('click', createEmployee);
        }
    }

    async function createEmployee(event) {
        event.preventDefault(); // Prevent the form from submitting the default way

        const step4Data = {
            grade: document.getElementById('grade')?.value || '',
            designation: document.getElementById('designation')?.value || '',
            department: document.getElementById('department')?.value?.toLowerCase().replace(/\s+/g, '') || '',
            workLocation: document.getElementById('loc')?.value || '',
            shift: document.getElementById('shift')?.value || '',
            holidayCategory: document.getElementById('hCat')?.value || '',
            company: document.getElementById('company')?.value || '',
            annual_ctc: document.getElementById('salary')?.value || '',
            officeEmail: document.getElementById('officemail')?.value || '',
            enterPassword: document.getElementById('mpass')?.value || '',
            reportsTo: document.getElementById('reportingmanager')?.value || '',
            shiftTiming: [{
                startTime: document.getElementById('startTime')?.value || '',
                endTime: document.getElementById('endTime')?.value || ''
            }]
        };

        const step1Data = JSON.parse(sessionStorage.getItem('step1Data') || '{}');
        const step2Data = JSON.parse(sessionStorage.getItem('step2Data') || '{}');
        const step3Data = JSON.parse(sessionStorage.getItem('step3Data') || '{}');

        const finalData = {
            ...step1Data,
            ...step2Data,
            ...step3Data,
            ...step4Data
        };

        console.log('Final Data:', finalData);

        try {
            const response = await fetch('http://localhost:4000/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalData)
            });

            console.log('Response:', response);

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
            } else {
                console.error('Request failed:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
});
