document.getElementById("signupSubmit").addEventListener("click", async () => {
    console.log("Signup button clicked!");

    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Data:", { firstName, lastName, email, password });

    const response = await fetch("http://127.0.0.1:3000/signup", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
        credentials: "include"
    });    

    const data = await response.json();

    if (response.ok) {
        alert("Signup successful!");
        window.location.reload();
    } else {
        alert(data.message);
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