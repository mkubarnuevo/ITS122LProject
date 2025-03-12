document.addEventListener('DOMContentLoaded', function() {
    const applicationsTabs = document.getElementById('applicationsTabs');
    const applicationDetails = document.getElementById('applicationDetails');
    let currentApplicationId = null;

    function fetchApplications() {
        fetch('http://localhost:3000/adoption_applications')
            .then(response => response.json())
            .then(applications => {
                applications.forEach((application, index) => {
                    const tab = document.createElement('div');
                    tab.classList.add('application-tab');
                    tab.textContent = `Application #${index + 1}`;
                    tab.addEventListener('click', () => toggleApplicationDetails(application._id));
                    applicationsTabs.appendChild(tab);
                });
            })
            .catch(error => console.error('Error fetching applications:', error));
    }

    function toggleApplicationDetails(applicationId) {
        if (currentApplicationId === applicationId) {
            applicationDetails.innerHTML = '';
            currentApplicationId = null;
        } else {
            displayApplicationDetails(applicationId);
            currentApplicationId = applicationId;
        }
    }

    function displayApplicationDetails(applicationId) {
        fetch('http://localhost:3000/adoption_applications/' + applicationId)
            .then(response => response.json())
            .then(application => {
                applicationDetails.innerHTML = `
                    <div class="application-profile">
                        <h3>Application Details</h3>
                        <p><strong>Pet Name:</strong> ${application.petName}</p>
                        <p><strong>Pet Breed:</strong> ${application.petBreed}</p>
                        <p><strong>Pet Age:</strong> ${application.petAge}</p>
                        <p><strong>Applicant Name:</strong> ${application.applicantName}</p>
                        <p><strong>Applicant Mobile:</strong> ${application.applicantMobile}</p>
                        <p><strong>Applicant Address:</strong> ${application.applicantAddress}</p>
                        <p><strong>Applicant Experience:</strong> ${application.applicantExperience}</p>
                    </div>
                `;
            })
            .catch(error => console.error('Error fetching application details:', error));
    }

    fetchApplications();
});