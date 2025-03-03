const authButtons = document.querySelectorAll('.authButton');
const authForms = document.querySelectorAll('.authForm');

authButtons.forEach(button => {
    button.addEventListener('click', () => {
        const authType = button.dataset.auth;
        console.log(`Switching to: ${authType}`);

        authButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        authForms.forEach(form => form.classList.remove('active'));
        document.getElementById(`${authType}Form`).classList.add('active');
    });
});

document.getElementById("signupSubmit").addEventListener("click", async () => {
    console.log("Signup button clicked!");

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Captured Data:", { firstName, lastName, email, password });

    try {
        console.log("Sending request to backend...");
        const response = await fetch("http://127.0.0.1:3000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, email, password }),
        });

        console.log("Request sent. Waiting for response...");
        const data = await response.json();
        console.log("Server Response:", data);

        if (response.ok) {
            alert("Signup successful!");
            window.location.reload();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error during signup:", error);
    }
});
