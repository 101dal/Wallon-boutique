document.addEventListener("DOMContentLoaded", () => {
    // Save changes for user
    document.querySelectorAll(".save-user").forEach(button => {
        button.addEventListener("click", () => {
            const userId = button.getAttribute("data-user-id");
            saveUserChanges(userId, button);
        });
    });

    // Delete user
    document.querySelectorAll(".delete-user").forEach(button => {
        button.addEventListener("click", () => {
            const userId = button.getAttribute("data-user-id");
            confirmDeletion(userId);
        });
    });

    async function saveUserChanges(userId, button) {
        if (confirm("Êtes-vous certain de vouloir modifier cet utilisateur ?")) {
            const userItem = document.querySelector(`.user-item[data-user-id='${userId}']`);
            const username = userItem.querySelector(".user-username").value;
            const email = userItem.querySelector(".user-email").value;
            const firstName = userItem.querySelector(".user-firstName").value;
            const lastName = userItem.querySelector(".user-lastName").value;
            const role = userItem.querySelector(".user-role").value;
            const level = userItem.querySelector(".user-level").value;
            const classe = userItem.querySelector(".user-classe").value;

            const response = await updateUser_request(username, email, firstName, lastName, role, level, classe, userId);
            if (response.status === 200) {
                button.classList.add("saved");
                button.querySelector("ion-icon").setAttribute("name", "checkmark-done-outline")
                setTimeout(() => {
                    button.querySelector("ion-icon").setAttribute("name", "save-outline")
                    button.classList.remove("saved");
                }, 1000);
            }
        }
    }

    async function confirmDeletion(userId) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            const response = await deleteUser_request(userId);
            if (response.status === 200) {
                document.querySelector(`.user-item[data-user-id='${userId}']`).remove();
            }
        }
    }

    async function updateUser_request(username, email, firstName, lastName, role, level, classe, id) {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("role", role);
        formData.append("level", level);
        formData.append("classe", classe);

        const response = await fetch(`http://localhost:3000/api/v1/users/update/${id}`, {
            method: "PATCH",
            credentials: "include",
            body: formData,
        });

        return await response.json();
    }

    async function deleteUser_request(id) {
        const response = await fetch(`http://localhost:3000/api/v1/users/delete/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        return await response.json();
    }
});