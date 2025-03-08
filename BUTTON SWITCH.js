document.addEventListener("DOMContentLoaded", async () => {
    await updateButtons();

    document.getElementById("logoutBtn").addEventListener("click", async () => {
        try {
            const res = await fetch("http://127.0.0.1:3000/logout", {
                method: "POST",
                credentials: "include",
            });
            const data = await res.json();

            console.log("Logout Response:", data);

            if (data.redirect) {
                window.location.href = data.redirect;
            } else {
                alert(data.message);
            }

            setTimeout(async () => {
                await updateButtons();
            }, 500);
        } catch (error) {
            console.error("Logout error:", error);
        }
    });
});

// BUTTON SWITCH.js
async function updateButtons() {
    try {
        console.log("Fetching session data (BUTTON SWITCH.js)");

        const res = await fetch("http://127.0.0.1:3000/session", {
            credentials: "include",
        });

        console.log("Session response received (BUTTON SWITCH.js):", res);

        if (!res.ok) {
            console.error("Session response not OK (BUTTON SWITCH.js):", res.status, res.statusText);
            return;
        }

        const data = await res.json();
        console.log("Session data received (BUTTON SWITCH.js):", data);

        const loginSignupBtn = document.getElementById("loginSignupBtn");
        const profileBtn = document.getElementById("profileBtn");
        const logoutBtn = document.getElementById("logoutBtn");
        const managePetsButton = document.querySelector('button[onclick="location.href=\'ADMIN MANAGE.html\';"]');

        if (!loginSignupBtn || !profileBtn || !logoutBtn || !managePetsButton) {
            console.error("One or more elements are missing from the DOM! (BUTTON SWITCH.js)");
            return;
        }

        if (data.isLoggedIn) {
            loginSignupBtn.style.display = "none";
            profileBtn.style.display = "inline-block";
            logoutBtn.style.display = "inline-block";

            if (data.user && data.user.admin) {
                managePetsButton.style.display = "inline-block";
            } else {
                managePetsButton.style.display = "none";
            }
        } else {
            loginSignupBtn.style.display = "inline-block";
            profileBtn.style.display = "none";
            logoutBtn.style.display = "none";
            managePetsButton.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching session data (BUTTON SWITCH.js):", error);
    }
}