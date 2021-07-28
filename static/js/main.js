const helpers = require("./helpers");

const loginButton = document.querySelector("#login-button");
const signInButton = document.querySelector("#sign-up-button");
// const errorMessages = document.getElementById("error-messages");

loginButton.addEventListener("click", helpers.setActiveButton);
signInButton.addEventListener("click", helpers.setActiveButton);

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    username: e.target.username.value,
    password: e.target.password.value,
    email: e.target.email.value,
  };

  

  helpers.clearAllInputFields();

  // TODO send the requests to the server.
  const requestType = location.hash;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  let endpoint = "";

  if (requestType == "#signup") {
    endpoint = "/auth/register";
  } else {
    endpoint = "/auth/login";
  }

  const response = await fetch(
    `https://brogrammers-habit-track.herokuapp.com${endpoint}`,
    options
  );


  const tokenData = await response.json();



  if (requestType === "#login") {
    const userData = jwt_decode(tokenData.token);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("username", userData.user);
    console.log(userData);
  } else {
    localStorage.setItem("userId", tokenData.id);
    localStorage.setItem("username", tokenData.user);
    console.log(tokenData);
  }



 

  

  window.location.assign(`https://the-stride.netlify.app/profile/`);

  //* Get the hash from the page to pick which fetch we do.
});

const accept = document.getElementById("accept");
const reject = document.querySelector("#reject");
const cancel = document.querySelector(".fa-times");


cancel.addEventListener("click", helpers.closeGDPR);
reject.addEventListener("click", helpers.closeGDPR);
accept.addEventListener("click", helpers.closeGDPR);