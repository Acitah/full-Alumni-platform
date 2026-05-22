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

//PROFILE
async function loadProfile() {
   try{
const res = await fetch(`${API_BASE}/users/profile`,{
    method:"GET",
    headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`
    }
});

const data = await res.json();
console.log("PROFILE RESPONSE:", data);
const user = data.result;


// Populate profile fields
document.getElementById("displayName").textContent = user.name;
document.getElementById("displayEmail").textContent = user.email;
document.getElementById("displayBio").textContent = user.bio || "No bio added yet.";

//populate form fields
document.getElementById("name").value = user.name|| "";
document.getElementById("email").value = user.email|| "";
document.getElementById("bio").value = user.bio || "";
document.getElementById("course").value = user.course || "";
document.getElementById("graduationYear").value = user.graduationYear || "";
document.getElementById("company").value = user.company || "";
document.getElementById("position").value = user.position || "";

res.status === 200 ? alert(data.message) : alert("Failed to load profile");

   }catch (error) {
    console.error("Load profile error:", error);
    res.status(500).json({message:"Error while fetching User Profile", error:error.message})
  }
}
//UPDATE PROFILE
document.getElementById("profileForm").addEventListener("submit", updateProfile);
async function updateProfile(e) {
    e.preventDefault();

try{
    const bio = document.getElementById("bio").value;
    const course = document.getElementById("course").value;
    const graduationYear = document.getElementById("graduationYear").value;
    const company = document.getElementById("company").value;
    const position = document.getElementById("position").value;

    const res = await fetch(`${API_BASE}/users/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            bio,
            course,
            graduationYear,
            company,
            position
        })
    });

    const data = await res.json();
    console.log("UPDATE PROFILE RESPONSE:", data);

    if (!res.ok) {
        alert(data.message);
        return;
    }

    alert("Profile updated!");
    loadProfile();
}catch(error){
    console.error("Update profile error:", error);
    alert("Error while updating profile: " + error.message);
}
}
// load on page start
// loadEvents();