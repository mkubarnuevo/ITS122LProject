signupButton.addEventListener("click", async () => {
    console.log("Signup button clicked!");

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Captured Data:", { firstName, lastName, email, password });

    try {
        console.log("Sending request to backend...");
        const response = await fetch("http://127.0.0.1:5500/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, email, password }),
        });

        console.log("Request sent. Waiting for response...");
        const data = await response.json();
        console.log("Server Response:", data);

        if (response.ok) {
            alert("Signup successful!");
            window.location.href = "success.html";
            alert(data.message);
        }
    } catch (error) {
        console.error("Error during signup:", error);
    }
});


document.getElementById("loginSubmit").addEventListener("click", async () => {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
        alert(data.message);
    }
});