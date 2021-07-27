(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// TESTED
function renderHabitData(data) {
    const newSection = document.createElement("section");
    newSection.classList.add("habit-details");

    const habitTitle = document.createElement("h2");
    habitTitle.textContent = data.habitname;

    const habitBoilerToday = document.createElement("h3");
    habitBoilerToday.textContent = "Today";

    const submittedToday = document.createElement("p");
    submittedToday.textContent = `${data.times_completed} of ${data.frequency_day}`;

    const habitBoilerStreak = document.createElement("h3");
    habitBoilerStreak.textContent = "Streak";

    const streak = document.createElement("p");
    streak.textContent = data.streak;

    newSection.append(habitTitle);
    newSection.append(habitBoilerToday);
    newSection.append(submittedToday);
    newSection.append(habitBoilerStreak);
    newSection.append(streak);

    return newSection;
}
// TESTED
function renderHabitContainer(data) {
    const newArticle = document.createElement("article");
    newArticle.id = data.id;
    newArticle.classList.add("habit-container");

    const habitData = renderHabitData(data);
    newArticle.append(habitData);

    const bgImage = document.createElement("img");
    bgImage.src = "../static/assets/ER0AQagU8AAUjHM.jpg";
    bgImage.classList.add("habit-gradient");
    bgImage.alt = "background gradient";
    //* the opacity is based on the percentage of the goal complete.
    bgImage.style.opacity = (parseInt(data.times_completed) / parseInt(data.frequency_day));
    newArticle.append(bgImage);

    const removeButton = document.createElement("button");
    removeButton.textContent = "remove";
    removeButton.classList.add("remove");
    newArticle.append(removeButton);   
    
    const addToCountButton = document.createElement("button");
    addToCountButton.id = "add-to-total";
    addToCountButton.type = "button";
    addToCountButton.textContent = "+";

    newArticle.append(addToCountButton);
    
    return newArticle;

}

// TESTED
function removeAllHabitContainers() {
    const articles = document.querySelectorAll("article");
    const articlesArr = Array.from(articles);


    articlesArr.forEach(article => {
        article.remove();
    });

}

// TESTED
function updateTimesCompleted(timesComplete, targetTimes, id) {

    const targetArticle = document.getElementById(`${id}`);
    
    const paragraph = targetArticle.querySelector("p");
    paragraph.textContent = `${timesComplete} of ${targetTimes}`;
    
}

// TESTED
function updateBackgroundOpacity(timesComplete, targetTimes, id) {
    const targetArticle = document.getElementById(`${id}`);
    
    const backgroundImage = targetArticle.querySelector("img");
    
    backgroundImage.style.opacity = (parseInt(timesComplete) / parseInt(targetTimes));
}

module.exports = {renderHabitContainer, removeAllHabitContainers, updateTimesCompleted, updateBackgroundOpacity};
},{}],2:[function(require,module,exports){
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
    };

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
    };

    const response = await fetch(`${serverUrl}/habits/${userId}`);
    const userData = await response.json();

    if (userData.length === 0) {
        console.log("no data found");
        return;
    };  
    
    userData.forEach(habit => {
        const newHabit = helpers.renderHabitContainer(habit);
        document.querySelector("#habits").append(newHabit);
    });

    bindEventListeners();

}

function toggleModal() {
    const modal = document.getElementById("add-new-habit");
    modal.classList.toggle("closed");
}

async function addHabit(e) {
    e.preventDefault();
    console.log(e.target);
    toggleModal();

    const data = {
        habitname: e.target.habitname.value,
        times_completed: 0,
        frequency_day: parseInt(e.target.frequency.value),
        streak: 0,
        username_id: localStorage.getItem("userId")
    };

    if (!data.frequency_day || !data.habitname) {
        return;
    };

    const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    await fetch(`${serverUrl}/habits`, options);

    // Reload the page to add the new item
    location.reload();

}

const newHabitForm = document.getElementById("new-habit-form");
newHabitForm.addEventListener("submit", addHabit);
const closeHabitButton = document.getElementById("close-button");
const newHabitButton = document.getElementById("new-habit");


closeHabitButton.addEventListener("click", toggleModal);
newHabitButton.addEventListener("click", toggleModal);



// Sign out button
const signOutButton = document.querySelector("header button");
signOutButton.addEventListener("click", () => {
    localStorage.removeItem("userId");
    window.location.assign("https://the-stride.netlify.app/"); // TODO update this to our live version.
});

getUserData();
},{"./helpers":1}]},{},[2]);
