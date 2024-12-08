async function logout_request() {
    const response = await fetch(`http://localhost:3000/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    });
    const data = await response.json();
    return data;
}


document.querySelector(".logout").addEventListener("click", async () => {
    await logout_request();
    window.location = "/?disconnected=true"
});