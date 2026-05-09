import { popupMessage } from "../lib/popups.js";
import { API_URL } from "../conf/api.js";
import { getUserInfo } from "../lib/util.js";

let runningUpdateUser = false;
let runningChangePassword = false;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("changepass-btn").addEventListener("click", function () {
        document.getElementById("old-pass").value = "";
        document.getElementById("new-pass0").value = "";
        document.getElementById("new-pass1").value = "";
        document.getElementById("changepass-form").style.display = "block";
    });
    document.getElementById("cancel-changepass-btn").addEventListener("click", function () {
        document.getElementById("changepass-form").style.display = "none";
    });
    document.getElementById("submit-changepass-btn").addEventListener("click", changePassword);
    document.getElementById("save-btn").addEventListener("click", updateUser);
    document.getElementById("logout-btn").addEventListener("click", logout);
    loadUserInfo();
});



async function loadUserInfo() {
    const data = await getUserInfo();
    if (!data) return;
    document.getElementById("email").value = data.user.email_address;
    document.getElementById("full-name").value = data.user.full_name;
    document.getElementById("student-id").value = data.user.student_id;
    document.getElementById("course-section").value = data.user.course_section;
    document.getElementById("contact-no").value = data.user.phone_number;
    document.getElementById("fb-profile").value = data.user.facebook_url;
    document.getElementById("account-createdat").innerText = data.user.created_at;
    document.getElementById("loggedin-page").style.display = "block";
    document.getElementById("loggedout-page").style.display = "none";
}



async function updateUser() {
    if (runningUpdateUser) return;
    runningUpdateUser = true;

    const fullname = document.getElementById("full-name").value.trim();
    const studentid = document.getElementById("student-id").value.trim();
    const contactno = document.getElementById("contact-no").value.trim();
    const fbprofile = document.getElementById("fb-profile").value.trim();
    const courseSection = document.getElementById("course-section").value.trim();

    try {
        const result = await fetch(API_URL + "/profile/update_user.php", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ 
                fullname, studentid, contactno, fbprofile, courseSection
            })
        });
        const response = await result.json();
        console.log(response);

        if (!response.success) throw new Error();
        else popupMessage("Successfully updated user info.");
    }
    catch (error) {
        console.error(error);
        popupMessage("Error updating user info.<br>Please try again.");
    }
    finally {
        runningUpdateUser = false;
    }
}



async function changePassword() {
    if (runningChangePassword) return;
    runningChangePassword = true;
    
    const current_password = document.getElementById("old-pass").value.trim();
    const new_password = document.getElementById("new-pass0").value.trim();
    const confirm_password = document.getElementById("new-pass1").value.trim();

    let invalidMessage = null;
    if (!current_password) invalidMessage = "Current password is required.";
    else if (!new_password) invalidMessage = "New password is required.";
    else if (new_password.length < 8) invalidMessage = "New password must be at least 8 characters.";
    else if (!confirm_password) invalidMessage = "Confirm password is required.";
    else if (new_password !== confirm_password) invalidMessage = "Passwords do not match.";
    else if (current_password === new_password) invalidMessage = "New password cannot be the same as the current password.";

    if (invalidMessage) {
        await popupMessage(invalidMessage);
        runningChangePassword = false;
        return;
    }

    try {
        const result = await fetch(API_URL + "/profile/change_pass.php", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({ 
                current_password, new_password
            })
        });
        const response = await result.json();
        console.log(response);

        if (!response.success) throw new Error();
        else popupMessage("Successfully changed password.");
    }
    catch (error) {
        console.error(error);
        popupMessage("Error changing password.<br>Please try again.");
    }
    finally {
        document.getElementById("changepass-form").style.display = "none";
        runningChangePassword = false;
    }
}


async function logout() {
    const result = await fetch(API_URL + "/profile/log_out.php", {method: "POST"});
    const response = await result.json();
    console.log(response);

    if (!response.success) popupMessage("Failed to logout.<br>Please try again.");
    else window.location.href = "login.html";
}