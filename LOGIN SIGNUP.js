document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = window.location.origin.includes("localhost")
        ? "http://127.0.0.1:3000"
        : "https://wealthy-hawk-its122lproject-400edd60.koyeb.app";

    const authButtons = document.querySelectorAll(".authButton");
    const authForms = document.querySelectorAll(".authForm");

    authButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const authType = button.dataset.auth;
            console.log(`Switching to: ${authType}`);

            authButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            authForms.forEach((form) => form.classList.remove("active"));
            document.getElementById(`${authType}Form`).classList.add("active");
        });
    });

    document.getElementById("signupSubmit").addEventListener("click", async () => {
        console.log("Signup button clicked!");

        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        console.log("Captured Data:", { firstName, lastName, email });

        try {
            console.log("Sending request to backend...");
            const response = await fetch(`${baseUrl}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
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

    document.getElementById("loginSubmit").addEventListener("click", async () => {
        console.log("Login button clicked!");

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        console.log("Captured Data:", { email });

        try {
            console.log("Sending request to backend...");
            const response = await fetch(`${baseUrl}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });

            console.log("Request sent. Waiting for response...");

            if (!response.ok) {
                console.error(`Server responded with status ${response.status}`);
                alert("Login failed: " + response.statusText);
                return;
            }

            const data = await response.json();
            console.log("Server Response:", data);

            if (response.ok) {
                alert("Login successful!");
                window.location.href = "HOMEPAGE.html";
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    });
});
