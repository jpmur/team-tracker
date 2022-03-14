
const home = document.getElementById("button_Olive");
const office = document.querySelector(".office-button");

function buttonPressHome(buttonId) {
    switch(buttonId) {
        case "buttonHome0_Jason":
            alert("jason pressed");
        case "buttonHome4_Olive":
            alert("olive pressed");
    }
}


const USER_HEIGHT = 65;
const TEAM = ["Olive", "Jason", "Salem", "Naman", "Stephen", "Eoin", "Diarmuid"];

document.addEventListener('DOMContentLoaded', function() {
    const boxHeight = (TEAM.length * USER_HEIGHT);
    document.getElementById("box").style.height = boxHeight.toString() + "px"
    TEAM.forEach((element) => {   
    // Add div for each user 
    var userDiv = document.createElement('div');
    userDiv.id = "user_" + element;
    userDiv.innerHTML = element;
    userDiv.style.fontWeight = "bold";
    userDiv.style.position = "relative"
    userDiv.style.paddingTop = "40px"; 
    document.getElementById("box").appendChild(userDiv);
    });

    TEAM.forEach((element) => {
        for (let i = 0; i < 5; i++) {
            // add home buttons for each user
            var buttonHome = document.createElement("button");
            buttonHome.id = "buttonHome" + i +"_" + element;
            buttonHome.style.position = "absolute";
            buttonHome.style.border = "none";
            buttonHome.style.borderRadius = "4px";
            buttonHome.style.cursor = "pointer";
            buttonHome.textContent = "Home";
            buttonHome.style.left = (150 + (i*160) - (i*28)).toString() + "px";
            // add office buttons for each user
            var buttonOffice = document.createElement("button");
            buttonOffice.id = "buttonOffice" + i +"_" + element;
            buttonOffice.style.position = "absolute";
            buttonOffice.style.border = "none";
            buttonOffice.style.borderRadius = "4px";
            buttonOffice.style.cursor = "pointer";
            buttonOffice.textContent = "Office";
            buttonOffice.style.left = (205 + (i*160) - (i*28)).toString() + "px";
            buttonOffice.onclick = function() {
                alert("officeButtonClicked");
            }
            document.getElementById("user_" + element).appendChild(buttonHome);
            document.getElementById("user_" + element).appendChild(buttonOffice);

            //buttonHome.addEventListener("click", buttonPressHome(buttonHome.id))
        };   
    });
});
  