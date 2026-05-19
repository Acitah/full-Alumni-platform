function login(){
    const savedUser = JSON.parse(localStorage.getItem("user"));
    // const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("loginMessage");

    message.innerText = "";

    if (!savedUser){
        message.innerText = "No account found. Please sign up."
        return;
    }
    if (email === savedUser.email && password === savedUser.password){
        message.innerText = "Login successful!";

        setTimeout(() => {
            window.location.href = "home.html";
        }, 1000);
    }else{
        message.innerText = "Invalid email or password";
    }

}