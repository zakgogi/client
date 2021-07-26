(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const loginButton = document.querySelector("#login-button");
const signInButton = document.querySelector("#sign-up-button");



function clearAllInputFields() {
    const inputs = document.querySelectorAll("input");
    
    for (let i = 0; i < inputs.length; i++) {
        if(inputs[i].type === "submit") {
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

    if (formHeading.textContent === "log in.") {
        location.hash = "signup";
        formHeading.textContent = "sign up.";
        submitButton.value = "sign up";
    } else {
        location.hash = "login";
        formHeading.textContent = "log in.";
        submitButton.value = "log in";
        
    };  
}


location.hash = "login";

module.exports = {setActiveButton, clearAllInputFields};
},{}],2:[function(require,module,exports){
const helpers = require("./helpers");

const loginButton = document.querySelector("#login-button");
const signInButton = document.querySelector("#sign-up-button");
const errorMessages = document.getElementById("error-messages");

loginButton.addEventListener("click", helpers.setActiveButton);
signInButton.addEventListener("click", helpers.setActiveButton);

const form = document.querySelector("form");


form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const data = {
        username: e.target.username.value,
        password: e.target.password.value
    };

    // if any of the values are falsy, i.e empty, don't process.
    for (const key in data) {
        if(!data[key]) {
        // this one is already live so no need to do anything.
            errorMessages.textContent = "username or password missing.";
            return;
        }
    };

    helpers.clearAllInputFields();
    
    // TODO send the requests to the server.




    //* Get the hash from the page to pick which fetch we do.

});
},{"./helpers":1}]},{},[2]);
