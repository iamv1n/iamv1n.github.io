const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");

loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    if (username === "lmaodedusers" && password === "yesudead") {
        alert("You have successfully logged in.");
        window.open("Blogs/Blog.html");
    }
})
