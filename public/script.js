
const home = document.getElementById("button_Olive");
const office = document.querySelector(".office-button");

function buttonPressHome(buttonId) {
    console.log(buttonId);
    button = document.getElementById(buttonId);
    button.style.backgroundColor = "lightblue";
}

function buttonPressHome(buttonId) {
    console.log(buttonId);
    button = document.getElementById(buttonId);
    button.style.backgroundColor = "lightblue";
}


const USER_HEIGHT = 65;
const team = ["Olive", "Jason", "Salem", "Naman", "Stephen", "Eoin", "Diarmuid"];

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
        for (let i = 0; i < 5; i++) {
            // add home buttons for each user
            var buttonHome = document.createElement("button");
            buttonHome.id = "buttonHome" + i +"_" + member;
            buttonHome.style.position = "absolute";
            buttonHome.style.border = "none";
            buttonHome.style.borderRadius = "4px";
            buttonHome.style.cursor = "pointer";
            buttonHome.textContent = "Home";
            buttonHome.style.left = (150 + (i*160) - (i*28)).toString() + "px";
            buttonHome.addEventListener("click", () => {
                buttonPressHome("buttonHome" + (i) + "_" + team[teamIdx]);
            })
            // add office buttons for each user
            var buttonOffice = document.createElement("button");
            buttonOffice.id = "buttonOffice" + i +"_" + member;
            buttonOffice.style.position = "absolute";
            buttonOffice.style.border = "none";
            buttonOffice.style.borderRadius = "4px";
            buttonOffice.style.cursor = "pointer";
            buttonOffice.textContent = "Office";
            buttonOffice.style.left = (205 + (i*160) - (i*28)).toString() + "px";
            buttonOffice.onclick = function() {
                alert("officeButtonClicked");
            }
            document.getElementById("user_" + member).appendChild(buttonHome);
            document.getElementById("user_" + member).appendChild(buttonOffice);

        };   
    });
    
});
  