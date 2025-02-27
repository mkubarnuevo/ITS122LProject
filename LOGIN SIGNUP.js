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