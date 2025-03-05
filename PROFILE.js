document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("http://127.0.0.1:3000/session", {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();

        if (data.isLoggedIn && data.user) {
            localStorage.setItem("loggedInUser", JSON.stringify(data.user));
            document.getElementById("firstName").value = data.user.firstName;
            document.getElementById("lastName").value = data.user.lastName;
            document.getElementById("email").value = data.user.email;
            await setupProfileEditing();
        } else {
            alert("You are not logged in!");
            window.location.href = "LOGIN SIGNUP.html";
        }
    } catch (error) {
        console.error("Error fetching session:", error);
    }
});

async function setupProfileEditing() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
        alert("Session expired. Please log in again.");
        window.location.href = "LOGIN SIGNUP.html";
        return;
    }

    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const editButton = document.getElementById("edit");
    const saveButton = document.getElementById("save_changes");

    if (!saveButton) {
        console.error("saveButton element not found");
        return;
    }

    saveButton.disabled = true;
    saveButton.style.display = "none";

    firstNameInput.setAttribute("readonly", true);
    lastNameInput.setAttribute("readonly", true);
    emailInput.setAttribute("readonly", true);

    editButton.addEventListener("click", () => {
        firstNameInput.removeAttribute("readonly");
        lastNameInput.removeAttribute("readonly");
        emailInput.removeAttribute("readonly");
        firstNameInput.focus();
        saveButton.disabled = false;
        saveButton.style.display = "block";
    });

    saveButton.addEventListener("click", () => {
        const updatedUser = {
            firstName: firstNameInput.value,
            lastName: lastNameInput.value,
            email: emailInput.value,
        };

        fetch(`http://127.0.0.1:3000/update-profile/${user._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(updatedUser),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Profile updated successfully") {
                alert("Profile updated!");
                localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
                firstNameInput.setAttribute("readonly", true);
                lastNameInput.setAttribute("readonly", true);
                emailInput.setAttribute("readonly", true);
                saveButton.disabled = true;
                saveButton.style.display = "none";
            } else {
                alert("Update failed: " + data.message);
            }
        })
        .catch(error => console.error("Error:", error));
    });
}