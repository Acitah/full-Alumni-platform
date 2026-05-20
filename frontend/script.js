// CONFIG
const API_BASE = 'http://localhost:5000';

let token = localStorage.getItem('token')||null;
let userName = localStorage.getItem('userName')||null;
let userId = localStorage.getItem('userId')||null;
let editingId = null;
let deletingId = null;

// SESSIO
function saveSession(tok, name, email){
    token = tok;
    userName = name;

    try {
        const payload = JSON.parse(atob(tok.split('.')[1]));
        userId = payload.id;
        localStorage.setItem('userId', userId);
    } catch (error) {
        
    }

    localStorage.setItem('token', tok);
    localStorage.setItem('userName', name);
}
// SIGN UP
async function signUp(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('password').value;  
    const confirmPassword = document.getElementById('confirm-password').value;
    const btn = document.getElementById('signup-btn');

    if (!email || !name || !password || !confirmPassword) {
    alert("Please fill all fields");
    return;
}

    try {
        const res = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, name, password, confirmPassword })
        });
        console.log(res);
        
        const data = await res.json();
        console.log("REGISTER RESPONSE:", data);

        if(!res.ok) throw new Error(data.message || 'Failed to register');
        saveSession(data.token, data.result.name, data.result.email);
        alert(data.message || 'Registration successful! Please log in.');
        document.getElementById('signupForm').reset();
        window.location.href = "login.html";
    } catch (error) {
        alert(error.message);
    }
}
//LOGIN
async function login(e){
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const btn = document.getElementById("login-btn");

    try {
        const res = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        console.log("LOGIN RESPONSE:", data);

        if (!res.ok) throw new Error(data.message || 'Failed to login');

        saveSession(data.token, data.result.name, data.result.email);
        
        alert(data.message || 'Login successful.');
        window.location.href = "home.html";
    } catch (error) {
        alert(error.message);
    }
}
//EVENTS


document.getElementById("createBtn")
.addEventListener("click", createEvent);

// CREATE EVENT
async function createEvent() {

  const token = localStorage.getItem("token");

  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const date = document.getElementById("date").value;
  const location = document.getElementById("location").value;

  const res = await fetch(`${API_BASE}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      title,
      description: desc,
      date,
      location
    })
  });

  const data = await res.json();
  console.log("CREATE EVENT RESPONSE:", data);

  if (!res.ok) {
    alert(data.message);
    return;
  }

  alert("Event created!");
  loadEvents();
}

// GET EVENTS
async function loadEvents() {

  try {
        const res = await fetch(`${API_BASE}/events`);
  const data = await res.json();

  const container = document.getElementById("eventsContainer");
  container.innerHTML = "";

  data.result.forEach(event => {

    const div = document.createElement("div");

    div.innerHTML = `
      <h3>${event.title}</h3>
      <p>${event.description}</p>
      <p><b>Date:</b> ${new Date(event.date).toDateString()}</p>
      <p><b>Location:</b> ${event.location}</p>
      <hr>
    `;

    container.appendChild(div);
  });
}
   catch (error) {
     console.error("Load events error:", error);
  }
}
// load on page start
// loadEvents();