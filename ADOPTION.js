document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('submitBtn');

    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            const petName = document.getElementById('petName').value;
            const petBreed = document.getElementById('petBreed').value;
            const petAge = document.getElementById('petAge').value;
            const applicantName = document.getElementById('applicantName').value;
            const applicantMobile = document.getElementById('applicantMobile').value;
            const applicantAddress = document.getElementById('applicantAddress').value;
            const applicantExperience = document.getElementById('applicantExperience').value;

            if (!petName || !petBreed || !petAge || !applicantName || !applicantMobile || !applicantAddress || !applicantExperience) {
                alert("Please fill in all fields.");
                return;
            }

            const adoptionData = {
                petName: petName,
                petBreed: petBreed,
                petAge: petAge,
                applicantName: applicantName,
                applicantMobile: applicantMobile,
                applicantAddress: applicantAddress,
                applicantExperience: applicantExperience
            };

            submitAdoptionApplication(adoptionData);
        });
    }
});

function submitAdoptionApplication(adoptionData) {
    const baseUrl = window.location.origin.includes("localhost")
        ? "http://localhost:3000"
        : "https://wealthy-hawk-its122lproject-400edd60.koyeb.app";

    fetch(`${baseUrl}/adoption_applications`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(adoptionData)
    })
        .then(response => {
            if (response.ok) {
                alert("Application submitted successfully!");
                document.getElementById('petName').value = '';
                document.getElementById('petBreed').value = '';
                document.getElementById('petAge').value = '';
                document.getElementById('applicantName').value = '';
                document.getElementById('applicantMobile').value = '';
                document.getElementById('applicantAddress').value = '';
                document.getElementById('applicantExperience').value = '';
            } else {
                return response.text().then(text => {
                    alert("Failed to submit application. Server responded with: " + text);
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while submitting the application.");
        });
}
