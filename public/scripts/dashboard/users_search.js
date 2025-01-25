document.addEventListener("DOMContentLoaded", () => {
    const filterUsername = document.getElementById("filter-username");
    const filterEmail = document.getElementById("filter-email");
    const filterFirstName = document.getElementById("filter-firstName");
    const filterLastName = document.getElementById("filter-lastName");
    const filterRole = document.getElementById("filter-role");
    const applyFiltersButton = document.getElementById("apply-filters");
    const userList = document.querySelector(".user-list");

    const applyFilters = async () => {
        const username = filterUsername.value.trim();
        const email = filterEmail.value.trim();
        const firstName = filterFirstName.value.trim();
        const lastName = filterLastName.value.trim();
        const role = filterRole.value;

        const queryParams = new URLSearchParams();
        if (username) queryParams.append('username', username);
        if (email) queryParams.append('email', email);
        if (firstName) queryParams.append('firstName', firstName);
        if (lastName) queryParams.append('lastName', lastName);
        if (role) queryParams.append('role', role);

        const response = await fetch(`http://localhost:3000/api/v1/users/search?${queryParams}`, {
            method: 'POST',
            credentials: 'include'
        });

        const data = await response.json();
        if (data.status === 200) {
            updateUserList(data.content);
        }
    };

    function updateUserList(users) {
        userList.innerHTML = '';
        users.forEach(user => {
            const userElement = createUserElement(user);
            userList.appendChild(userElement);
        });
    }

    function createUserElement(user) {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.setAttribute('data-user-id', user.id);
        
        // Créer le HTML pour l'élément utilisateur (similaire au template EJS)
        userItem.innerHTML = `
            <div class="users-info">
                <label>Nom d'utilisateur :
                    <input type="text" value="${user.username}" class="user-username" />
                </label>
                <label>Email :
                    <input type="email" value="${user.email}" class="user-email" />
                </label>
                <label>Prénom :
                    <input type="text" value="${user.firstName}" class="user-firstName" />
                </label>
                <label>Nom :
                    <input type="text" value="${user.lastName}" class="user-lastName" />
                </label>
                <label>Rôle :
                    <select class="user-role">
                        <option value="USER" ${user.role === 'USER' ? 'selected' : ''}>Utilisateur</option>
                        <option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>Administrateur</option>
                    </select>
                </label>
                <label>Niveau :
                    <input type="text" value="${user.level}" class="user-level" />
                </label>
                <label>Classe :
                    <input type="text" value="${user.classe}" class="user-classe" />
                </label>
            </div>
            <div class="user-actions">
                <button class="save-user" data-user-id="${user.id}"><ion-icon name="save-outline"></ion-icon></button>
                <button class="delete-user" data-user-id="${user.id}"><ion-icon name="trash-outline"></ion-icon></button>
            </div>
        `;

        // Réattacher les événements
        userItem.querySelector('.save-user').addEventListener('click', (e) => {
            const button = e.currentTarget;
            const userId = button.getAttribute('data-user-id');
            saveUserChanges(userId, button);
        });

        userItem.querySelector('.delete-user').addEventListener('click', (e) => {
            const button = e.currentTarget;
            const userId = button.getAttribute('data-user-id');
            confirmDeletion(userId);
        });

        return userItem;
    }

    applyFiltersButton.addEventListener("click", applyFilters);
});