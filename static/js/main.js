console.log("hello");

const loginButton = document.querySelector("#login-button");
const signInButton = document.querySelector("#sign-up-button");



function setActiveButton(e) {
    // See is the button which called the event already active.
    // if it is do nothing.
    
    if (e.target.classList.contains("active")) {
        // this one is already live so no need to do anything.
        return;
    }
    loginButton.classList.toggle("active");
    signInButton.classList.toggle("active");
}

loginButton.addEventListener("click", setActiveButton);
signInButton.addEventListener("click", setActiveButton);