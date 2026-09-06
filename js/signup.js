const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const userData = {
        username: username,
        email: email,
        password: password
    };

    fetch("http://localhost:3000", {
    method: "POST",
    body: JSON.stringify(userData)
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
    });
});