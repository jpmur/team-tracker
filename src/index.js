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
const unsavedUsers = []; // array that tracks user's who's settings have been changed since page load
const uncheckedUsers = []; // array that tracks user's who's "Store Settings" checkbox in unchecked
const saveTick = document.getElementById("tick");


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* Main script that runs on page load that populates the page based on the users in "team" array
   and reads user settings from the DB. */
document.addEventListener('DOMContentLoaded', async () => {
    // Load all user data from DB
    await loadUserSettings();
    // Check if user data needs to deleted from DB
    await checkNewWeek();

    // Set height of main box based on number of users.
    const boxHeight = (team.length * USER_HEIGHT);
    document.getElementById("box").style.height = boxHeight.toString() + "px"

    // Add div in main box for each user 
    team.forEach((user) => {   
    var userDiv = document.createElement('div');
    userDiv.id = "user_" + user;
    userDiv.innerHTML = user;
    userDiv.style.fontSize = "17px";
    userDiv.style.fontWeight = "bold";
    userDiv.style.position = "relative"
    userDiv.style.paddingTop = "40px"; 
    userDiv.style.paddingBottom = "3px"; 
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
            buttonHome.style.left = (130 + (dayIdx*132)).toString() + "px";
            buttonHome.style.fontFamily = "Barlow";
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
            buttonOffice.style.left = (187 + (dayIdx*132)).toString() + "px";
            buttonOffice.style.fontFamily = "Barlow";
            buttonOffice.addEventListener("click", () => {
                buttonHandler("buttonOffice" + (day) + "_" + team[teamIdx]);
            });
            document.getElementById("user_" + user).appendChild(buttonHome);
            document.getElementById("user_" + user).appendChild(buttonOffice);
        });   

        // "Store Settings" checkboxes
        var checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = `checkbox${user}`;
        checkBox.style.position = "absolute";
        checkBox.style.left = "790px";
        checkBox.style.top = "45px";
        checkBox.addEventListener("change", () => {
            if(checkBox.checked) {
                user = team[teamIdx];
                userSettings[user].storeSettings = true;
            }
            else { userSettings[user].storeSettings = false }
            addToUnsavedUsers(user);
        });
        // Checkbox labels
        var label = document.createElement('label')
        label.htmlFor = `checkbox${user}`;
        label.appendChild(document.createTextNode('Store Settings'));
        label.style.position = "absolute";
        label.style.left = "813px";
        label.style.top = "42px";

        document.getElementById("user_" + user).appendChild(checkBox);
        document.getElementById("user_" + user).appendChild(label);
    });
    document.getElementById("saveButton").addEventListener("click", saveUserSettings);
    // After UI is populated, add user settings to it
    updateButtonsFromDb()
});


/* Handler for all home/office buttons.
   Reads which button was pressed and updates user settings accordingly. */
function buttonHandler(buttonId) {
    saveTick.style.opacity = "0"; // Make save tick disappear

    const clickedButton = document.getElementById(buttonId);

    // If button has already been clicked, remove colour, else add colour.
    if(clickedButton.style.backgroundColor == RED || clickedButton.style.backgroundColor == BLUE){
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
    });
}


/* Update button/checkbox states based on data stored in DB. */
function updateButtonsFromDb() {
    // Update buttons
    for(var user in userSettings) {
        for(var day of Object.keys(userSettings[user])) {
            switch(userSettings[user][day]) {
                case "home":
                    addButtonColour(document.getElementById("buttonHome" + day + "_" + user), RED);
                    removeButtonColour(document.getElementById("buttonOffice" + day + "_" + user));
                    break;
                case "office":
                    addButtonColour(document.getElementById("buttonOffice" + day + "_" + user), BLUE);
                    removeButtonColour(document.getElementById("buttonHome" + day + "_" + user));
            }
        }
        // Update checkboxes 
        if(userSettings[user].storeSettings) {
            document.getElementById(`checkbox${user}`).checked = true;
        }
    }
}


/* Updates local copy of user settings each time a button is pressed. */
function updateUserSettings(buttonId, clickType) {
    // Parse button ID string to extract key parameters (user name, day, home/office)
    var buttonType = "office";
    if(buttonId.includes("Home")) { buttonType = "home" };
    const user = buttonId.split("_")[1];
    const buttonDay = buttonId.split("_")[0].substr(-3);

    // Add user's name to unsaved user's list
    addToUnsavedUsers(user);

    const currentUserSettings = userSettings[user]; // extract the user's current settings from DB JSON tree
    if(clickType == "click") {
    currentUserSettings[buttonDay] = buttonType; // update appropriate day with home/office choice in the user's JSON object
    }
    else if (clickType == "unclick") {
        currentUserSettings[buttonDay] = ""; // update appropriate day with null in the user's JSON object
    }
    else { console.log("updateUserSettings(): Invalid click option") }

    userSettings[user] = currentUserSettings; // write updated object back into DB tree
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

    if((currentTime - lastResetMs) > WEEK_MS) {
        await clearUserSettingsDb();
        // Update local copy of user settings
        uncheckedUsers.forEach(user => {
            days.forEach(day => {
                userSettings[user][day] = "";
            });
        })
        // Update reset timestamp in DB
        const timestamp = Timestamp.now();
        const docRef = doc(db, "time", "reset");
        await setDoc(docRef, {
            timestamp: timestamp
        });
    }
}


/* Function that deletes all user settings in DB with a batch write */
async function clearUserSettingsDb() {
    // Check all checkboxes to determine which user settings to delete
    team.forEach(user => {
        if(!(userSettings[user].storeSettings)){
            uncheckedUsers.push(user);
        }
    });

    const batch = writeBatch(db);
    uncheckedUsers.forEach(user => {
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


function addToUnsavedUsers(user) {
    if (!(unsavedUsers.includes(user))) {
        unsavedUsers.push(user);
    }
}
