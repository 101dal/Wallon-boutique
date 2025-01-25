async function checkout_request() {
    const formData = new FormData();
    const response = await fetch(`http://localhost:3000/api/v1/carts/checkout`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    return data;
}

document.addEventListener("DOMContentLoaded", async () => {
    await document.querySelector(".validate-order").addEventListener("click", async (event) => {
        if (confirm("Veuillez confirmer la commande")) {
            await checkout_request();
            window.location.reload();
        }
    })
})
