import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBbjVi2kk14O2o25Ps1m3_NgEZh4A44Jmk",
  authDomain: "team-tracker-41c94.firebaseapp.com",
  projectId: "team-tracker-41c94",
  storageBucket: "team-tracker-41c94.appspot.com",
  messagingSenderId: "906695542885",
  appId: "1:906695542885:web:a0c77fab36ea80f5961e8c",
  measurementId: "G-0JKMFQGDB6"
};

const USER_HEIGHT = 65; // height of main box added for each user
const DB_COLLECTION = "users";
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const team = ["Olive", "Jason", "Salem", "Naman", "Stephen", "Eoin", "Diarmuid"];
var userSettings = {};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// async function loadCity(name) {
//     team.forEach(element => {
//         setDoc(doc(db, `users`, element), {
//             Mon: "",
//             Tue: "",
//             Wed: "",
//             Thu: "",
//             Fri: ""
//         })
//     });
//   }

// Read user settings from DB
async function readUserSettings() {
    for (const user of team) {
        const docRef = doc(db, DB_COLLECTION, user);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            userSettings[docSnap.id] = docSnap.data();
        } else {
        console.log("Document not found in collection!");
        }
    }

    for (var userName in userSettings){
        updateButtonsFromDb(userName, userSettings[userName]);
    }
}

// Update button states based on data stored in DB
function updateButtonsFromDb(userName, userSettings) {
    for(var day in userSettings) {
        switch(userSettings[day]) {
            case "home":
                document.getElementById("buttonHome" + day + "_" + userName).style.backgroundColor = "lightblue";
                document.getElementById("buttonOffice" + day + "_" + userName).style.backgroundColor = "#ECEFF1";
                break;
            case "office":
                document.getElementById("buttonOffice" + day + "_" + userName).style.backgroundColor = "lightblue";
                document.getElementById("buttonHome" + day + "_" + userName).style.backgroundColor = "#ECEFF1";
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
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
                buttonHandler("buttonHome" + (day) + "_" + team[teamIdx]);
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
                buttonHandler("buttonOffice" + (day) + "_" + team[teamIdx]);
            });
            document.getElementById("user_" + user).appendChild(buttonHome);
            document.getElementById("user_" + user).appendChild(buttonOffice);
        });   
    });
    document.getElementById("saveButton").addEventListener("click", saveUserSettings);
    readUserSettings();
});



function buttonHandler(buttonId) {
    const clickedButton = document.getElementById(buttonId);

    // if button has already been clicked, remove colour, else add colour
    if(clickedButton.style.backgroundColor == "lightblue"){
        clickedButton.style.backgroundColor = "#ECEFF1";
    }
    else {clickedButton.style.backgroundColor = "lightblue";}

    // remove colour from opposite button for that day
    if(buttonId.includes("Home")) {
        var oppButton = document.getElementById(buttonId.replace("Home", "Office"));
    } else {
        var oppButton = document.getElementById(buttonId.replace("Office", "Home"));
    }
    oppButton.style.backgroundColor = "#ECEFF1";
    updateUserSettings(buttonId);
}

function updateUserSettings(buttonId) {
    // Parse button ID string to extract key parameters (user name, day, home/office)
    var buttonType = "office";
    if(buttonId.includes("Home")) { buttonType = "home" };
    const userName = buttonId.split("_")[1];
    const buttonDay = buttonId.split("_")[0].substr(-3);

    const currentUserSettings = userSettings[userName];   // extract the user's current settings from DB JSON tree
    currentUserSettings[buttonDay] = buttonType;          // update appropriate day within the user's JSON object
    userSettings[userName] = currentUserSettings;         // write updated object back into DB tree
}

async function saveUserSettings(){
    for (const user of team) {
        const docRef = doc(db, DB_COLLECTION, user);
        await updateDoc(docRef, userSettings);
    }
}