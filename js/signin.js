const signinForm = document.getElementById("signinForm");
const loginMessage = document.getElementById("loginMessage");

signinForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = {
        action: "login",
        email: email,
        password: password
    };

    console.log(userData);

    fetch("http://localhost:3000", {
        method: "POST",
        body: JSON.stringify(userData)
    })
    .then(response => response.text())
    .then(data => {
        loginMessage.textContent = data;

        if (data === "Login realizado!") {
            window.location.href = "index.html";
        }
    });
});