import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBbjVi2kk14O2o25Ps1m3_NgEZh4A44Jmk",
  authDomain: "team-tracker-41c94.firebaseapp.com",
  projectId: "team-tracker-41c94",
  storageBucket: "team-tracker-41c94.appspot.com",
  messagingSenderId: "906695542885",
  appId: "1:906695542885:web:a0c77fab36ea80f5961e8c",
  measurementId: "G-0JKMFQGDB6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const USER_HEIGHT = 65; // height of main box added for each user
const days = ["Mon", "Tues", "Wed", "Thurs", "Fri"];
const team = ["Olive", "Jason", "Salem", "Naman", "Stephen", "Eoin", "Diarmuid"];


// Read user settings from DB
async function readUserSettings() {
    const users = {};

    for (const user of team) {
        const docRef = doc(db, "users", user);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            users[docSnap.id] = docSnap.data();
        } else {
        console.log("Document not found in collection!");
        }
    }
    console.log(users);

    for(var user in users) {
        updateButtonsFromDb(users.user);
    }
}
// Update button states accordingly
function updateButtonsFromDb(user){
    for(var day in days) {
        switch(day) {
            case "home":
                document.getElementById("buttonHome" + day + "_" + Object.keys(user)).style.backgroundColor = "lightblue";
                document.getElementById("buttonOffice" + day + "_" + Object.keys(user)).style.backgroundColor = "#ECEFF1";
            case "office":
                document.getElementById("buttonOffice" + day + "_" + Object.keys(user)).style.backgroundColor = "lightblue";
                document.getElementById("buttonHome" + day + "_" + Object.keys(user)).style.backgroundColor = "#ECEFF1";
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    // Set height of main box based on number of users
    const boxHeight = (team.length * USER_HEIGHT);
    document.getElementById("box").style.height = boxHeight.toString() + "px"

    // Add div in main box for each user 
    team.forEach((user) => {   
    var userDiv = document.createElement('div');
    userDiv.id = "user_" + user;
    userDiv.innerHTML = user;
    userDiv.style.fontWeight = "bold";
    userDiv.style.position = "relative"
    userDiv.style.paddingTop = "40px"; 
    document.getElementById("box").appendChild(userDiv);
    });

    // Add buttons for each user for each day of the week
    team.forEach((user, teamIdx) => {
        days.forEach((day, dayIdx) => {
            // home buttons
            var buttonHome = document.createElement("button");
            buttonHome.id = `buttonHome${day}_${user}`;
            buttonHome.style.position = "absolute";
            buttonHome.style.border = "none";
            buttonHome.style.borderRadius = "4px";
            buttonHome.style.cursor = "pointer";
            buttonHome.textContent = "Home";
            buttonHome.style.padding = "7px";
            buttonHome.style.left = (152 + (dayIdx*160) - (dayIdx*28)).toString() + "px";
            buttonHome.addEventListener("click", () => {
                buttonHandlerHome("buttonHome" + (day) + "_" + team[teamIdx]);
            });

            // office buttons 
            var buttonOffice = document.createElement("button");
            buttonOffice.id = `buttonOffice${day}_${user}`;
            buttonOffice.style.position = "absolute";
            buttonOffice.style.border = "none";
            buttonOffice.style.borderRadius = "4px";
            buttonOffice.style.cursor = "pointer";
            buttonOffice.textContent = "Office";
            buttonOffice.style.padding = "7px";
            buttonOffice.style.left = (207 + (dayIdx*160) - (dayIdx*28)).toString() + "px";
            buttonOffice.addEventListener("click", () => {
                buttonHandlerOffice("buttonOffice" + (day) + "_" + team[teamIdx]);
            });
            document.getElementById("user_" + user).appendChild(buttonHome);
            document.getElementById("user_" + user).appendChild(buttonOffice);
        });   
    });
    readUserSettings();
});


function buttonHandlerHome(buttonId) {
    var clickedButton = document.getElementById(buttonId);

    // if button has already been clicked, remove colour, else add colour
    if(clickedButton.style.backgroundColor == "lightblue"){
        clickedButton.style.backgroundColor = "#ECEFF1";
    }
    else {clickedButton.style.backgroundColor = "lightblue";}

    // remove colour from corresponding office button for that day
    var otherButton = document.getElementById(buttonId.replace("Home", "Office"));
    otherButton.style.backgroundColor = "#ECEFF1";
}

function buttonHandlerOffice(buttonId) {
    var clickedButton = document.getElementById(buttonId);

    // if button has already been clicked, remove colour, else add colour
    if(clickedButton.style.backgroundColor == "lightblue"){
        clickedButton.style.backgroundColor = "#ECEFF1";
    } 
    else {clickedButton.style.backgroundColor = "lightblue";}

    // remove colour from corresponding office button for that day
    var otherButton = document.getElementById(buttonId.replace("Office", "Home"));
    otherButton.style.backgroundColor = "#ECEFF1";
}


  