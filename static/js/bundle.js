(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{}]},{},[1]);
