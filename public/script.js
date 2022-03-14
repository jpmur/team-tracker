const USER_HEIGHT = 65; // height of main box added for each user
const days = ["Mon", "Tues", "Wed", "Thurs", "Fri"];
const team = ["Olive", "Jason", "Salem", "Naman", "Stephen", "Eoin", "Diarmuid", "mcj"];

document.addEventListener('DOMContentLoaded', function() {
    const boxHeight = (team.length * USER_HEIGHT);
    document.getElementById("box").style.height = boxHeight.toString() + "px"
    team.forEach((element) => {   
    // Add div for each user 
    var userDiv = document.createElement('div');
    userDiv.id = "user_" + element;
    userDiv.innerHTML = element;
    userDiv.style.fontWeight = "bold";
    userDiv.style.position = "relative"
    userDiv.style.paddingTop = "40px"; 
    document.getElementById("box").appendChild(userDiv);
    });

    team.forEach((member, teamIdx) => {
        days.forEach((day, dayIdx) => {
            // add home buttons for each user
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
                buttonPressHome("buttonHome" + (day) + "_" + team[teamIdx]);
            });

            // add office buttons for each user
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
                buttonPressOffice("buttonOffice" + (day) + "_" + team[teamIdx]);
            });

            document.getElementById("user_" + member).appendChild(buttonHome);
            document.getElementById("user_" + member).appendChild(buttonOffice);
        });   
    });
});


function buttonPressHome(buttonId) {
    clickedButton = document.getElementById(buttonId);
    // if button has already been clicked, remove colour, else add colour
    if(clickedButton.style.backgroundColor == "lightblue"){
        clickedButton.style.backgroundColor = "#ECEFF1"
    }
    else {clickedButton.style.backgroundColor = "lightblue";}

    // remove colour from corresponding office button for that day
    otherButton = document.getElementById(buttonId.replace("Home", "Office"));
    otherButton.style.backgroundColor = "#ECEFF1";
    
}

function buttonPressOffice(buttonId) {
    clickedButton = document.getElementById(buttonId);
    // if button has already been clicked, remove colour, else add colour
    if(clickedButton.style.backgroundColor == "lightblue"){
        clickedButton.style.backgroundColor = "#ECEFF1"
    }
    else {clickedButton.style.backgroundColor = "lightblue";}

    // remove colour from corresponding office button for that day
    otherButton = document.getElementById(buttonId.replace("Office", "Home"));
    otherButton.style.backgroundColor = "#ECEFF1";
}


  