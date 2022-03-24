import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, Timestamp} from 'firebase/firestore';

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
const BLUE = "rgb(41, 121, 226)";
const GREY = "rgb(236, 239, 241)";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const team = ["Olive", "Jason", "Salem", "Naman", "Stephen", "Eoin", "Diarmuid"];
var userSettings = {};
const unsavedUsers = [];
const saveTick = document.getElementById("tick");

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


document.addEventListener('DOMContentLoaded', () => {
    checkNewWeek();

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
            // Home buttons
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

            // Office buttons 
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
    loadUserSettings();
});


function buttonHandler(buttonId) {
    // Make save tick disappear
    saveTick.style.opacity = "0";

    const clickedButton = document.getElementById(buttonId);

    // If button has already been clicked, remove colour, else add colour
    if(clickedButton.style.backgroundColor == BLUE){
        removeButtonColour(clickedButton);
        updateUserSettings(buttonId, "unclick"); // Remove user setting from local storage
        return;
    }
    else { addButtonColour(clickedButton); }

    // Remove colour from opposite button for that day
    if(buttonId.includes("Home")) {
        var oppButton = document.getElementById(buttonId.replace("Home", "Office"));
    } else {
        var oppButton = document.getElementById(buttonId.replace("Office", "Home"));
    }
    removeButtonColour(oppButton);

    // Store changes locally
    updateUserSettings(buttonId, "click");
}

async function loadUserSettings() {
    const querySnapshot = await getDocs(collection(db, DB_COLLECTION));
    querySnapshot.forEach((user) => {
    userSettings[user.id] = user.data();
    updateButtonsFromDb(user.id, user.data())
    });
}
// Update button states based on data stored in DB
function updateButtonsFromDb(userName, userSettings) {
    for(var day in userSettings) {
        switch(userSettings[day]) {
            case "home":
                addButtonColour(document.getElementById("buttonHome" + day + "_" + userName));
                removeButtonColour(document.getElementById("buttonOffice" + day + "_" + userName));
                break;
            case "office":
                addButtonColour(document.getElementById("buttonOffice" + day + "_" + userName));
                removeButtonColour(document.getElementById("buttonHome" + day + "_" + userName));
        }
    }
}

function updateUserSettings(buttonId, clickType) {
    // Parse button ID string to extract key parameters (user name, day, home/office)
    var buttonType = "office";
    if(buttonId.includes("Home")) { buttonType = "home" };
    const userName = buttonId.split("_")[1];
    const buttonDay = buttonId.split("_")[0].substr(-3);

    // Add user's name to unsaved user's list (if not already added)
    if (!(unsavedUsers.includes(userName))) {
        unsavedUsers.push(userName);
    }
    
    const currentUserSettings = userSettings[userName];   // extract the user's current settings from DB JSON tree
    if(clickType == "click") {
    currentUserSettings[buttonDay] = buttonType;          // update appropriate day with home/office choice in the user's JSON object
    }
    else if (clickType == "unclick") {
        currentUserSettings[buttonDay] = "";              // update appropriate day with null in the user's JSON object
    }
    else { console.log("updateUserSettings(): Invalid click option") }

    userSettings[userName] = currentUserSettings;         // write updated object back into DB tree
}

async function saveUserSettings() {
    for (const user of unsavedUsers) {
        const docRef = doc(db, DB_COLLECTION, user);
        try {
            await setDoc(docRef, userSettings[user]);
            document.getElementById("tick").style.opacity = "1";
        } catch(e) {
            console.error(e);
        }
    }
}

async function checkNewWeek() {
    const timeDoc = doc(db, "time", "reset");
    const timeData = await getDoc(timeDoc);
    const lastReset = timeData.data();
    console.log(timestamp["seconds"]);
    

    // const timestamp = Timestamp.now();
    // const dateNow = timestamp.toDate();
    



    // const docRef = doc(db, "time", "reset");
    // try {
    //     await setDoc(docRef, {timestamp: timestamp});
    // } catch(e) {
    //     console.error(e);
    // }


    const date = new Date(dateNow)
    // console.log(date.getTime());


}

function addButtonColour(button) {
    button.style.backgroundColor = BLUE;
    button.style.color = "white";
}

function removeButtonColour(button) {
    button.style.backgroundColor = GREY;
    button.style.color = "black";
}
