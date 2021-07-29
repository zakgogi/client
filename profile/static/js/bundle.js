(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const avatarOptions = { 
    "a"  : "fas fa-dragon red",
    "b"  : "fas fa-dragon blue",
    "c"  : "fas fa-dragon purple",
    "d"  : "fas fa-dragon red",
    "e"  : "fas fa-dragon blue",
    "f"  : "fas fa-dragon purple",
    "g"  : "fas fa-cat green",
    "h"  : "fas fa-cat green",
    "i"  : "fas fa-cat red",
    "j"  : "fas fa-cat blue",
    "k"  : "fas fa-cat purple",
    "l"  : "fas fa-cat green",
    "m"  : "fas fa-spider gold",
    "n"  : "fas fa-spider red",
    "o"  : "fas fa-spider blue",
    "p"  : "fas fa-spider purple",
    "q"  : "fas fa-spider gold",
    "r"  : "fas fa-spider gold",
    "s"  : "fas fa-horse-head red",
    "t"  : "fas fa-horse-head blue",
    "u"  : "fas fa-horse-head purple",
    "v"  : "fas fa-horse-head gold",
    "w"  : "fas fa-horse-head gold",
    "x"  : "fas fa-dove red",
    "y"  : "fas fa-dove blue",
    "z"  : "fas fa-dove purple",
};

module.exports = avatarOptions;
},{}],2:[function(require,module,exports){
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
  streak.id = "streak-output";
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
  bgImage.style.opacity =
    parseInt(data.times_completed) / parseInt(data.frequency_day);
  newArticle.append(bgImage);

  const removeButton = document.createElement("button");
  // removeButton.textContent = "delete";
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

  articlesArr.forEach((article) => {
    article.remove();
  });
}

// TESTED
function updateTimesCompleted(timesComplete, targetTimes, id) {
  const targetArticle = document.getElementById(`${id}`);

  const paragraph = targetArticle.querySelector("p");
  paragraph.textContent = `${timesComplete} of ${targetTimes}`;

  if (timesComplete == targetTimes) {
    console.log("we might need to do something else here too.");
    const target = targetArticle.querySelectorAll("p")[1];
    target.textContent = parseInt(target.textContent) + 1;

    // update the dom streak total.
  }
}

// TESTED
function updateBackgroundOpacity(timesComplete, targetTimes, id) {
  const targetArticle = document.getElementById(`${id}`);

  const backgroundImage = targetArticle.querySelector("img");

  backgroundImage.style.opacity =
    parseInt(timesComplete) / parseInt(targetTimes);
}

// TESTED
function uniqueBadges(data) {
  const output = [];
  for (let i = 0; i < data.length; i++) {
    if (!output.includes(data[i].badge_name)) {
      output.push(data[i].badge_name);
    }
  }
  return output;
}

// TESTED
function createBadgeSection(badges) {
  const badgesContainer = document.createElement("section");
  badgesContainer.id = "badge-display";

  badges.forEach((badge) => {
    let imgSrc = `../../../static/assets/badges/${badge}.svg`;
    const newImg = document.createElement("img");
    newImg.src = imgSrc;
    newImg.alt = `${badge} badge`;
    newImg.classList.add("badge");
    badgesContainer.append(newImg);
  });

  return badgesContainer;
}

module.exports = {
  renderHabitContainer,
  removeAllHabitContainers,
  updateTimesCompleted,
  updateBackgroundOpacity,
  uniqueBadges,
  createBadgeSection
};

},{}],3:[function(require,module,exports){
const helpers = require("./helpers");
const serverUrl = "https://brogrammers-habit-track.herokuapp.com";
const avatarOptions = require("./avatars");

let myChart;
let executed;

async function buttonEvents(e) {
  const targetArticle = e.target.closest("article");

  let dailyTarget = targetArticle.querySelector("p").textContent.split(" ")[2];
  dailyTarget = parseInt(dailyTarget);

  let currentCount = targetArticle.querySelector("p").textContent.split(" ")[0];
  currentCount = parseInt(currentCount);

  if (currentCount + 1 > dailyTarget) {
    M.toast({html: 'You\'ve already hit your daily target!'})
    // Already maxed out.
    return;
  }

  let halfdailyTarget = dailyTarget/2;
  if (!executed) {
  if(currentCount + 1 >= halfdailyTarget){
        M.toast({html: 'Keep going, you\'re over half way there!'});
        executed = true;
      }
  };

  if(currentCount + 1 === dailyTarget){
    M.toast({html: 'Well done! You\'ve hit your daily target!'}) 
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
  M.toast({html: 'Habit Deleted!'}) // added in alert
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
  document.getElementById("profileName").textContent = username;
  let avatarLetter = username[0];
  let avatartag = avatarOptions[avatarLetter];
  let avatar = document.querySelector("i");
  avatar.className = `${avatartag} fa-5x`;


  if (!userId) {
    return;
  }

  const response = await fetch(`${serverUrl}/habits/${userId}`);
  const userData = await response.json();

 

  if (userData.length === 0) {
    hideChart();
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


  const badgeNames = helpers.uniqueBadges(data);

  

  if (stillToDo === 0) {
    badgeNames.push("daily");

    //! Add toast 
  }

  const badgeSection = helpers.createBadgeSection(badgeNames);

  if (document.querySelector("#profileInfo section")) {
    document.querySelector("#profileInfo section").remove();
  }

  document.querySelector("#profileInfo").append(badgeSection);
  
}



async function getBadgeData() {
  const userId = localStorage.getItem("userId");

  const response = await fetch(`${serverUrl}/badges/${userId}`);
  const data = await response.json();

  return data;
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
}
getUserData();


},{"./avatars":1,"./helpers":2}]},{},[3]);
