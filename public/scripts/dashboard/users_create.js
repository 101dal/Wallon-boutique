async function createUser_request(username, email, password, firstName, lastName, role, level, classe) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('role', role);
    formData.append('level', level);
    formData.append('classe', classe);

    const response = await fetch(`http://localhost:3000/api/v1/users/create`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    return data;
}

document.getElementById("add-user-form").addEventListener("submit", async event => {
    event.preventDefault();

    const username = document.getElementById("user-username").value;
    const email = document.getElementById("user-email").value;
    const password = document.getElementById("user-password").value;
    const firstName = document.getElementById("user-firstName").value;
    const lastName = document.getElementById("user-lastName").value;
    const role = document.getElementById("user-role").value;
    const level = document.getElementById("user-level").value;
    const classe = document.getElementById("user-classe").value;

    const response = await createUser_request(username, email, password, firstName, lastName, role, level, classe);

    if (response.status === 200) {
        alert("Utilisateur créé avec succès!");
        location.reload();
    } else {
        alert(`Erreur lors de la création de l'utilisateur: ${response}`);
        console.log(response);
    }
});