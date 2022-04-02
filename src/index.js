import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, Timestamp, writeBatch} from 'firebase/firestore';

/* Constants */
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
const RED = "rgb(242, 90, 90)"
const GREY = "rgb(236, 239, 241)";
const WEEK_MS = (7 * 24 * 60 * 60 * 1000);

const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const team = ["Olive", "Jason", "Salem", "Naman", "Stephen", "Eoin", "Diarmuid"];
var userSettings = {};
const unsavedUsers = []; // array that tracks user's who's settings have been changed since page load.
const saveTick = document.getElementById("tick");


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* Main script that runs on page load that populates the page based on the users in "team" array
   and reads user settings from the DB. */
document.addEventListener('DOMContentLoaded', () => {
    //checkNewWeek();

    // Set height of main box based on number of users.
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

    // Add buttons for each user for each day of the week.
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


/* Handler for all home/office buttons.
   Reads which button was pressed and updates user settings accordingly. */
function buttonHandler(buttonId) {
    saveTick.style.opacity = "0"; // Make save tick disappear

    const clickedButton = document.getElementById(buttonId);

    // If button has already been clicked, remove colour, else add colour.
    if(clickedButton.style.backgroundColor != GREY){
        removeButtonColour(clickedButton);
        updateUserSettings(buttonId, "unclick"); // Remove user setting from local storage.
        return;
    }
    else {
        var colour = BLUE;
        if(buttonId.includes("Home")){
            colour = RED;
        }
        addButtonColour(clickedButton, colour); 
    }

    // Remove colour from opposite button for that day
    if(buttonId.includes("Home")) {
        var oppButton = document.getElementById(buttonId.replace("Home", "Office"));
    } else {
        var oppButton = document.getElementById(buttonId.replace("Office", "Home"));
    }
    removeButtonColour(oppButton);

    updateUserSettings(buttonId, "click"); // Store changes locally
}

/* Retrieve current user settings from DB and make local copy. 
   Update button states based on this data. */
async function loadUserSettings() {
    const querySnapshot = await getDocs(collection(db, DB_COLLECTION));
    querySnapshot.forEach((user) => {
    userSettings[user.id] = user.data();
    updateButtonsFromDb(user.id, user.data())
    });
}

/* Update button states based on data stored in DB. */
function updateButtonsFromDb(userName, userSettings) {
    for(var day in userSettings) {
        switch(userSettings[day]) {
            case "home":
                addButtonColour(document.getElementById("buttonHome" + day + "_" + userName), RED);
                removeButtonColour(document.getElementById("buttonOffice" + day + "_" + userName));
                break;
            case "office":
                addButtonColour(document.getElementById("buttonOffice" + day + "_" + userName), BLUE);
                removeButtonColour(document.getElementById("buttonHome" + day + "_" + userName));
        }
    }
}

/* Updates local copy of user settings each time a button is pressed. */
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
    
    const currentUserSettings = userSettings[userName]; // extract the user's current settings from DB JSON tree
    if(clickType == "click") {
    currentUserSettings[buttonDay] = buttonType; // update appropriate day with home/office choice in the user's JSON object
    }
    else if (clickType == "unclick") {
        currentUserSettings[buttonDay] = ""; // update appropriate day with null in the user's JSON object
    }
    else { console.log("updateUserSettings(): Invalid click option") }

    userSettings[userName] = currentUserSettings; // write updated object back into DB tree
}

/* Save Button Handler - writes current local user settings to DB
   Only users who's settings have been changed since page load will be updated. */
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
    // Get last reset timestamp from DB (ms since Unix epoch)
    const timestampDb = await getDoc(doc(db, "time", "reset"));
    const lastReset = timestampDb.data();
    const lastResetMs= (lastReset["timestamp"]["seconds"]) * 1000;

    // Get current time (ms since Unix epoch)
    const currentTime = Timestamp.now().toMillis();

    if((currentTime - lastResetMs) > 1) {
        clearUserSettingsDb();
    }
}

/* Function that clears all user settings in DB with a batch write */
async function clearUserSettingsDb() {
    const batch = writeBatch(db);
    team.forEach(user => {
        const userRef = doc(db, DB_COLLECTION, user);
        batch.update(userRef, {
            Mon: "",
            Tue: "",
            Wed: "",
            Thu: "",
            Fri: ""
        });
    });
    await batch.commit();
}

function addButtonColour(button, colour) {
    button.style.backgroundColor = colour;
    button.style.color = "white";
}

function removeButtonColour(button) {
    button.style.backgroundColor = GREY;
    button.style.color = "black";
}
