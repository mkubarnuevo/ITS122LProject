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

async function updateButtons() {
    try {
        const res = await fetch("http://127.0.0.1:3000/session", { credentials: "include" });
        const data = await res.json();
        console.log("Session data received:", data);

        const loginSignupBtn = document.getElementById("loginSignupBtn");
        const profileBtn = document.getElementById("profileBtn");
        const logoutBtn = document.getElementById("logoutBtn");

        if (!loginSignupBtn || !profileBtn || !logoutBtn) {
            console.error("One or more elements are missing from the DOM!");
            return;
        }

        if (data.isLoggedIn) {
            loginSignupBtn.style.display = "none";
            profileBtn.style.display = "inline-block";
            logoutBtn.style.display = "inline-block";
        } else {
            loginSignupBtn.style.display = "inline-block";
            profileBtn.style.display = "none";
            logoutBtn.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching session data:", error);
    }
}
