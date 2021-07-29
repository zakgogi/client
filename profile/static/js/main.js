const helpers = require("./helpers");
const serverUrl = "https://brogrammers-habit-track.herokuapp.com";

let myChart;

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
    frequency_day: dailyTarget,
  };

  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  };

  await fetch(`${serverUrl}/habits`, options);

  
  getGraphData();
  updateBadgesToProfile();
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
  getGraphData();

  e.target.closest("article").remove();
  hideChart();
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

  //===== Email Reminder =====//
  const reminderButtons = document.querySelectorAll("#email-reminder");
  const reminderButtonsArr = Array.from(reminderButtons);
  reminderButtonsArr.forEach((button) => {
    button.addEventListener("click", toggleReminderModal);
    button.addEventListener("click", storeArticleId);
  })
}

const newReminderForm = document.getElementById("add-new-reminder");
newReminderForm.addEventListener("submit", sendEmailPostRequest);
const closeReminderButton = document.getElementById("close-button-reminder");

closeReminderButton.addEventListener("click", toggleReminderModal);

function storeArticleId(e){
  const closeId = e.target.closest("article").id;
  localStorage.setItem("targetArticleId", closeId);
}

function toggleReminderModal() {
  const modal = document.getElementById("add-new-reminder");
  modal.classList.toggle("closed");
}

async function sendEmailPostRequest(e){
  e.preventDefault();
  toggleReminderModal();
  const habitId = localStorage.getItem("targetArticleId");
  localStorage.removeItem("targetArticleId");
  const targetArticle = document.getElementById(`${habitId}`);
  let currentTitle = targetArticle.querySelector("h2").textContent;
  let username = localStorage.getItem("username");
  let toSend = { 
    habitname: currentTitle,
    //because currently BST, will need to remove -1 when GMT
    timeHour: e.target.timeHour.value - 1,
    timeMin: e.target.timeMinute.value,
    username: username
  }
  if (!toSend.timeHour || !toSend.timeMin) {
    return;
  }

  const options = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toSend)
  }

  const response = await fetch(`${serverUrl}/habits/email`, options);
  console.log("Sent email request");
}

async function getUserData() {
  const userId = localStorage.getItem("userId");

  const knownUser = (localStorage.getItem("userId")) ? true : false;
  localStorage.setItem("knownUser", knownUser);

  if (!knownUser) {
    localStorage.setItem("username", "Stranger");
  }

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

 

  console.log(userData);

  if (userData.length === 0) {
    hideChart();
    console.log("no data found");
    return;
  }

  let totalDone = 0;
  let totalToDo = 0;
  userData.forEach((habit) => {
    const newHabit = helpers.renderHabitContainer(habit);
    document.querySelector("#habits").append(newHabit);
    totalDone += habit.times_completed;
    totalToDo += habit.frequency_day;
  });
  let stillToDo = totalToDo - totalDone;
  updateBadgesToProfile()
  renderGraph([totalDone, stillToDo]);
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
    username_id: localStorage.getItem("userId"),
  };

  if (!data.frequency_day || !data.habitname) {
    return;
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  await fetch(`${serverUrl}/habits`, options);

  // Reload the page to add the new item
  location.reload();
}

async function getGraphData() {
  const userId = localStorage.getItem("userId");

  const response = await fetch(`${serverUrl}/habits/${userId}`);
  const userData = await response.json();

  let totalDone = 0;
  let totalToDo = 0;

  userData.forEach((habit) => {
    totalDone += habit.times_completed;
    totalToDo += habit.frequency_day;
  });
  
  let stillToDo = totalToDo - totalDone;

  renderGraph([totalDone, stillToDo]);
  bindEventListeners();
}

async function updateBadgesToProfile() {
  const data = await getBadgeData();

  // get all unique badges.
  const badgeNames = helpers.uniqueBadges(data);

  
  const badgeSection = helpers.createBadgeSection(badgeNames);

  if (document.querySelector("#profileInfo section")) {
    document.querySelector("#profileInfo section").remove();
  }

  document.querySelector("#profileInfo").append(badgeSection);
  
  // TODO create a div full of images.



}

async function getBadgeData() {
  const userId = localStorage.getItem("userId");

  const response = await fetch(`${serverUrl}/badges/${userId}`);
  const data = await response.json();

  console.log(data);
  return data;
}

const newHabitForm = document.getElementById("new-habit-form");
newHabitForm.addEventListener("submit", addHabit);
const closeHabitButton = document.getElementById("close-button");
const newHabitButton = document.getElementById("new-habit");

closeHabitButton.addEventListener("click", toggleModal);
newHabitButton.addEventListener("click", toggleModal);

function toggleModal() {
  const modal = document.getElementById("add-new-habit");
  modal.classList.toggle("closed");
}



// Sign out button
const signOutButton = document.querySelector("header button");
signOutButton.addEventListener("click", () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("knownUser");
  // TODO remove everything.
  window.location.assign("https://the-stride.netlify.app/"); // TODO update this to our live version.
});

const signOutButton2 = document.querySelector("#hidden button");
signOutButton2.addEventListener("click", () => {
  localStorage.removeItem("userId");
  window.location.assign("https://the-stride.netlify.app/"); // TODO update this to our live version.
});

function renderGraph(dataInput) {
  var xValues = ["Goals Completed", "Still to do"];
  var barColors = ["#58c770", "#c4c4c4"];
  let chart = document.getElementById("myChart");
  if (!!myChart) {
    myChart.destroy();
  }
  // myChart.destroy();
  myChart = new Chart("myChart", {
    type: "doughnut",
    options: {
      legend: {
        display: false,
      },
      animation: false,
    },
    data: {
      labels: xValues,
      datasets: [
        {
          backgroundColor: barColors,
          data: dataInput,
        },
      ],
    },
  });
}


// This function hides chart when there is no habits available.
function hideChart() {
  let chart = document.getElementById("myChart");
  let profile = document.getElementById("user-info");
  if (!document.querySelector("article")) {
    chart.style.display = "none";
    profile.style.height = "150px";
  }
  console.log("trig");
}
getUserData();

