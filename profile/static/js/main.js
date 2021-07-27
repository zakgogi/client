const helpers = require("./helpers");
const serverUrl = "http://localhost:3000";

async function buttonEvents(e) {
  const targetArticle = e.target.closest("article");

  let dailyTarget = targetArticle.querySelector("p").textContent.split(" ")[2];
  dailyTarget = parseInt(dailyTarget);

  let currentCount = targetArticle.querySelector("p").textContent.split(" ")[0];
  currentCount = parseInt(currentCount);

  if (currentCount + 1 > dailyTarget) {
    // Already maxed out.
    return;
  }

  currentCount++;


    helpers.updateTimesCompleted(currentCount, dailyTarget, targetArticle.id);
    helpers.updateBackgroundOpacity(currentCount, dailyTarget, targetArticle.id);
   
    // Update the server
    const eventData = {
        id: targetArticle.id,
        times_completed: currentCount,
        frequency_day: dailyTarget
    };


  helpers.updateTimesCompleted(currentCount, dailyTarget, targetArticle.id);
  helpers.updateBackgroundOpacity(currentCount, dailyTarget, targetArticle.id);

  // Update the server
  const eventData = {
    id: targetArticle.id,
    times_completed: currentCount,
  };

  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  };

  await fetch(`${serverUrl}/habits`, options);
}

async function removeHabit(e) {
  const habitId = e.target.closest("article").id;

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: habitId }),
  };

  await fetch(`${serverUrl}/habits`, options);

  e.target.closest("article").remove();
}

function bindEventListeners() {
  //===== Add to count =====//
  const addButtons = document.querySelectorAll("#add-to-total");
  const addButtonsArr = Array.from(addButtons);
  addButtonsArr.forEach((button) => {
    button.addEventListener("click", buttonEvents);
  });

  //===== Remove habit =====//
  const removeButtons = document.querySelectorAll(".remove");
  const removeButtonsArr = Array.from(removeButtons);
  removeButtonsArr.forEach((button) => {
    button.addEventListener("click", removeHabit);
  });
}

async function getUserData() {
  const userId = localStorage.getItem("userId");

  //* Create custom title
  const username = localStorage.getItem("username");
  document.title = `${username}'s Habits`;
  console.log(document.getElementById("profileName"));
  document.getElementById("profileName").textContent = username;

  if (!userId) {
    return;
  }

  const response = await fetch(`${serverUrl}/habits/${userId}`);
  const userData = await response.json();

  if (userData.length === 0) {
    console.log("no data found");
    return;
  }

  userData.forEach((habit) => {
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


function toggleModal() {
  const modal = document.getElementById("add-new-habit");
  modal.classList.toggle("closed");
}

closeHabitButton.addEventListener("click", toggleModal);
newHabitButton.addEventListener("click", toggleModal);

// Sign out button
const signOutButton = document.querySelector("header button");
signOutButton.addEventListener("click", () => {
  localStorage.removeItem("userId");
  window.location.assign("https://the-stride.netlify.app/"); // TODO update this to our live version.
});



function renderGraph() {
    
    var xValues = ["Goals Smashed", "Still to Smash"];
var yValues = [70, 100];
var barColors = [
  "#b91d47",
  "#00aba9"
];
    var myChart = new Chart("myChart", {
  type: "pie",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  }
});
}



getUserData();
renderGraph();

