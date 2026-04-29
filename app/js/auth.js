import { popupMessage } from '../lib/popups.js';
import { API_URL } from '../conf/api.js';

let runningSubmitForm = false;
let runningRequestCode = false;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("register-tabbtn").addEventListener("click", function () {changeForm("register")});
    document.getElementById("login-tabbtn").addEventListener("click", function () {changeForm("login")});
    document.getElementById("register-btn").addEventListener("click", submitRegisterForm);
    document.getElementById("login-btn").addEventListener("click", submitLoginForm);
    document.getElementById("getcode-btn").addEventListener("click", requestCode);
});



async function submitLoginForm() {
    if (runningSubmitForm) return;
    runningSubmitForm = true;

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-pass").value.trim();

    let invalidMessage = null;
    if (!email) 
        invalidMessage = "Email is required.";
    else if (!password) 
        invalidMessage = "Password is required.";

    if (invalidMessage) {
        await popupMessage(invalidMessage);
        runningSubmitForm = false;
        return;
    }

    try {
        const result = await fetch(API_URL + "/auth/login.php", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ 
                email, password
            })
        });
        const response = await result.json();
        console.log(response);

        if (response.success) {
            switch(response.data['user_role']) {
                case "Admin": 
                    window.location.href = "admin.html";
                break;
                case "Normal": 
                    window.location.href = "search_found.html";
                break;
            }
        }
        else throw new Error();
    }
    catch (error) {
        console.error(error);
        await popupMessage("Login failed.<br><br>Please check your credentials.");
        runningSubmitForm = false;
    }
}



async function submitRegisterForm() {
    if (runningSubmitForm) return;
    runningSubmitForm = true;

    const confirmPassword = document.getElementById("register-pass1").value.trim();
    const password = document.getElementById("register-pass0").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const code = document.getElementById("register-code").value.trim();

    let invalidMessage = null;
    if (!email) 
        invalidMessage = "Email is required.";
    else if (!password) 
        invalidMessage = "Password is required.";
    else if (password.length < 8) 
        invalidMessage = "Password must be at least 8 characters.";
    else if (password !== confirmPassword) 
        invalidMessage = "Passwords do not match.";
    else if (!code) 
        invalidMessage = "Verification code is required.";

    if (invalidMessage) {
        await popupMessage(invalidMessage);
        runningSubmitForm = false;
        return;
    }

    try {
        const result = await fetch(API_URL + "/auth/register.php", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ 
                email, password, code 
            })
        });
        const response = await result.json();
        console.log(response);

        if (response.success) {
            await popupMessage("Registration successful!<br><br>You can now login.");
            changeForm("login");
            email.value = "";
            code.value = "";
            password.value = "";
            confirmPassword.value = "";
        }
        else throw new Error();
    }
    catch (error) {
        console.error(error);
        await popupMessage("Registration failed.<br><br>Please try again.");
    }
    finally {
        runningSubmitForm = false;
    }
}



async function requestCode() {
    if (runningRequestCode) return;
    runningRequestCode = true;

    const email = document.getElementById("register-email").value.trim();

    let invalidMessage = null;
    if (!email) 
        invalidMessage = "Email is required.";
    else if (!email.includes("@") || !email.includes(".") || email.length < 10) 
        invalidMessage = "Please enter a valid email address.";

    if (invalidMessage) {
        await popupMessage(invalidMessage);
        runningRequestCode = false;
        return;
    }

    try {
        const result = await fetch(API_URL + "/auth/request_code.php", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({
                email
            })
        });
        const response = await result.json();
        console.log(response);

        if (response.success) {
            await popupMessage("Verification code sent!<br><br>Please check your email.");
        }
        else throw new Error();
    }
    catch (error) {
        console.error(error);
        await popupMessage("Failed to send code.<br><br>Please try again.");
    }
    finally {
        runningRequestCode = false;
    }
}



function changeForm(form) {
    switch(form) {
        case "login":
            document.getElementById("login-pass").value = "";
            document.getElementById("login-email").value = "";
            document.getElementById("login-form").style.display = "block";
            document.getElementById("register-form").style.display = "none";
        break;
        case "register":
            document.getElementById("login-form").style.display = "none";
            document.getElementById("register-form").style.display = "block";
        break;
    }
}