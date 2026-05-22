//PROFILE
const API_BASE = 'http://localhost:5000';

let token = localStorage.getItem('token')||null;
let userName = localStorage.getItem('userName')||null;
let userId = localStorage.getItem('userId')||null;
let editingId = null;
let deletingId = null;

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
document.getElementById("name").value = user.FullName|| "";
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
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const course = document.getElementById("course").value;
    const graduationYear = document.getElementById("graduationYear").value;
    const company = document.getElementById("company").value;
    const position = document.getElementById("position").value;

    const res = await fetch(`${API_BASE}/users/profile`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
        email,
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
    //console.error("Update profile error:", error);
    alert("Error while updating profile: " + error.message);
}
}