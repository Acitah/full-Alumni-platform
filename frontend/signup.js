function signup(){
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const message = document.getElementById("message");

    //clear previous message
    message.innerText = "";

    //check empty fields
    if (!name || !email || !password || !confirmPassword){
        message.innerText = "Please fill in all Fields";
        return;
    }
    //checking password match
    if (password !== confirmPassword){
        message.innerText = "Passwords do not match";
        return;
    }
    //saving user using email as unique key
    const user = {
        name: name,
        email: email,
        password: password
    }; 
    localStorage.setItem("user", JSON.stringify(user));

    message.innerText = "Sign up successful!  Redirecting....."

    //Redirecting to login
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}