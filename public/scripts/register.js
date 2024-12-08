async function register_request(username, email, password, firstName, lastName, level, classe) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('level', level);
    formData.append('classe', classe);
    const response = await fetch(`http://localhost:3000/api/v1/auth/register`, {
        method: 'POST',
        body: formData,
    });
    const data = await response.json();
    return data;
 }
 
const authForm = document.querySelector(".auth-form");
authForm.addEventListener("submit", async event => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const level = document.getElementById("level").value;
    const classe = document.getElementById("classe").value;

    // console.log(username, email, password, firstName, lastName, level, classe)

    const response = await register_request(username, email, password, firstName, lastName, level, classe);

    console.log(response);

    // Auth Reponses
    const registerError = document.querySelector(".register-error");
    const registerSuccess = document.querySelector(".register-success");
    if (response.status != 201) {
        registerError.hidden = false;
        registerSuccess.hidden = true;
        registerError.innerHTML = `<b>Errors :</b><br>${response.content.join('<br>')}`;
    } else {
        registerError.hidden = true;
        registerSuccess.hidden = false;
        registerSuccess.innerHTML = "Register successful";
    }
})