const helpers = require("./helpers");
const serverUrl = "http://localhost:3000";


async function getUserData() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        return;
    }

    const response = await fetch(`${serverUrl}/habits/${userId}`);
    const userData = await response.json();

    if (userData.length === 0) {
        console.log("no data found");
        return;
    }     
    // add a 
    userData.forEach(habit => {
        const newHabit = helpers.renderHabitContainer(habit);
        document.querySelector("#habits").append(newHabit);
    });

    bindEventListeners();
}

async function buttonEvents(e) {
    const targetArticle = e.target.closest("article");

    let dailyTarget = targetArticle.querySelector("p").textContent.split(" ")[2];
    dailyTarget = parseInt(dailyTarget);
    
    let currentCount = targetArticle.querySelector("p").textContent.split(" ")[0];
    currentCount = parseInt(currentCount);

    if ((currentCount + 1) > dailyTarget) {
        // Already maxed out.
        return;
    }

    currentCount++;


    // Update the dom

    helpers.updateTimesCompleted(currentCount, dailyTarget, targetArticle.id);

    
    helpers.updateBackgroundOpacity(currentCount, dailyTarget, targetArticle.id);
   

   

    // Update the server
    const eventData = {
        id: targetArticle.id,
        times_completed: currentCount
    };

    const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData)
      };

    const response = await fetch(`${serverUrl}/habits`, options);

      

    // helpers.removeAllHabitContainers();
    // getUserData();

}

async function removeHabit(e) {
    const habitId = e.target.closest("article").id;
    
    const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({id: habitId})
      };

    const response = await fetch(`${serverUrl}/habits`, options);

    e.target.closest("article").remove();
}

function bindEventListeners() {

    //===== Add to count =====//
    const addButtons = document.querySelectorAll("#add-to-total");
    const addButtonsArr = Array.from(addButtons);
    addButtonsArr.forEach(button => {
        button.addEventListener("click", buttonEvents);
    });

    //===== Remove habit =====//
    const removeButtons = document.querySelectorAll(".remove");
    const removeButtonsArr = Array.from(removeButtons);
    removeButtonsArr.forEach(button => {
        button.addEventListener("click", removeHabit);
    });
}



// Sign out button
const signOutButton = document.querySelector("header button");
signOutButton.addEventListener("click", () => {
    localStorage.removeItem('userId');
    window.location.assign("http://[::]:8000/#login"); // TODO update this to our live version.
});

getUserData();