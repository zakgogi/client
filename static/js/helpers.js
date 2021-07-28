const loginButton = document.querySelector("#login-button");
const signInButton = document.querySelector("#sign-up-button");

function clearAllInputFields() {
  const inputs = document.querySelectorAll("input");

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].type === "submit") {
      continue;
    } else {
      inputs[i].value = "";
    }
  }
}

function setActiveButton(e) {
  // See is the button which called the event already active.
  // if it is do nothing.

  if (e.target.classList.contains("active")) {
    // this one is already live so no need to do anything.
    return;
  }

  clearAllInputFields();

  loginButton.classList.toggle("active");
  signInButton.classList.toggle("active");

  const formHeading = document.getElementById("form-heading");
  const submitButton = document.getElementById("submit-button");
  const email = document.getElementById("emailEntry");
  const card = document.getElementById("login-signin");

  if (formHeading.textContent === "log in.") {
    location.hash = "signup";
    formHeading.textContent = "sign up.";
    submitButton.value = "sign up";
    email.style.display = "block";
    card.style.height = "auto";
  } else {
    location.hash = "login";
    formHeading.textContent = "log in.";
    submitButton.value = "log in";
    email.style.display = "none";
    card.style.height = "350px";
  }
}

const dismiss = document.getElementById("dismiss");
const cancel = document.querySelector(".fa-times");
const gdpr = document.querySelector("#gdpr");

dismiss.addEventListener("click", closeGDPR);
cancel.addEventListener("click", closeGDPR);

function closeGDPR() {
  gdpr.style.display = "none";
}

location.hash = "login";

module.exports = { setActiveButton, clearAllInputFields, closeGDPR };
