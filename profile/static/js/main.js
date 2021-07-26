const helpers = require("./helpers");
const serverUrl = "http://localhost:3000";

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

    await fetch(`${serverUrl}/habits`, options);

      

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

    await fetch(`${serverUrl}/habits`, options);

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

async function getUserData() {
    const userId = localStorage.getItem("userId");

    //* Create custom title
    const username = localStorage.getItem("username");
    document.title = `${username}'s Habits`;

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

const newHabitForm = document.getElementById("new-habit-form");
newHabitForm.addEventListener("submit", addHabit);

async function addHabit(e) {
    e.preventDefault();
    console.log(e.target);

    // TODO Collect the users data.

    const data = {
        habitname: e.target.habitname.value, // ! get from modal form
        times_completed: 0,
        frequency_day: parseInt(e.target.frequency.value), // ! get from modal form
        streak: 0,
        username_id: localStorage.getItem("userId")
    };

    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    // TODO Add it to the database

    await fetch(`${serverUrl}/habits`, options);

    // TODO add the new element to the dom.


}


const newHabitButton = document.getElementById("new-habit");

newHabitButton.addEventListener("click", toggleModal);

function toggleModal() {
    const modal = document.getElementById("add-new-habit");
    modal.classList.toggle("closed");
}

// Sign out button
const signOutButton = document.querySelector("header button");
signOutButton.addEventListener("click", () => {
    localStorage.removeItem("userId");
    window.location.assign("https://the-stride.netlify.app/"); // TODO update this to our live version.
});

getUserData();