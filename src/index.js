import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

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

const cityDoc = doc(db, `students/yr3`);
async function loadCity(name) {
  const data = {
      name: "John",
      age: "21"
  }
  setDoc(cityDoc, data);
}

const USER_HEIGHT = 65; // height of main box added for each user
const days = ["Mon", "Tues", "Wed", "Thurs", "Fri"];
const team = ["Olive", "Jason", "Salem", "Naman", "Stephen", "Eoin", "Diarmuid"];

document.addEventListener('DOMContentLoaded', function() {
    // set height of main box based on number of users
    const boxHeight = (team.length * USER_HEIGHT);
    document.getElementById("box").style.height = boxHeight.toString() + "px"

    // Add div in main box for each user 
    team.forEach((element) => {   
    var userDiv = document.createElement('div');
    userDiv.id = "user_" + element;
    userDiv.innerHTML = element;
    userDiv.style.fontWeight = "bold";
    userDiv.style.position = "relative"
    userDiv.style.paddingTop = "40px"; 
    document.getElementById("box").appendChild(userDiv);
    });

    // add buttons for each user for each day of the week
    team.forEach((member, teamIdx) => {
        days.forEach((day, dayIdx) => {
            // home buttons
            var buttonHome = document.createElement("button");
            buttonHome.id = `buttonHome${day}_${member}`;
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
            buttonOffice.id = `buttonOffice${day}_${member}`;
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
            document.getElementById("user_" + member).appendChild(buttonHome);
            document.getElementById("user_" + member).appendChild(buttonOffice);
        });   
    });
});


function buttonHandlerHome(buttonId) {
    var clickedButton = document.getElementById(buttonId);

    // if button has already been clicked, remove colour, else add colour
    if(clickedButton.style.backgroundColor == "lightblue"){
        clickedButton.style.backgroundColor = "#ECEFF1"
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
        clickedButton.style.backgroundColor = "#ECEFF1"
    } 
    else {clickedButton.style.backgroundColor = "lightblue";}

    // remove colour from corresponding office button for that day
    var otherButton = document.getElementById(buttonId.replace("Office", "Home"));
    otherButton.style.backgroundColor = "#ECEFF1";
}


  