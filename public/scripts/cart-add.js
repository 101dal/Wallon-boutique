async function addToCart_request(product_id, color, size, quantity) {
    const formData = new FormData();
    formData.append('product_id', product_id);
    formData.append('color', color);
    formData.append('size', size);
    formData.append('quantity', quantity);
    const response = await fetch(`http://localhost:3000/api/v1/carts/add`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    return data;
}



async function addToCart_request(product_id, color, size, quantity) {
    const formData = new FormData();
    formData.append('product_id', product_id);
    formData.append('color', color);
    formData.append('size', size);
    formData.append('quantity', quantity);
    const response = await fetch(`http://localhost:3000/api/v1/carts/add`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    return data;
}

document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach(button => {
        button.addEventListener("click", async function () {
            const productId = this.dataset.productId;

            // Get the selected values from the form fields
            const color = document.getElementById("product-color") ? document.getElementById("product-color").value : "";
            const size = document.getElementById("product-size") ? document.getElementById("product-size").value : "";
            const quantity = document.getElementById("product-quantity").value || 1;

            // Send the request
            const response = await addToCart_request(productId, color, size, quantity);
            if (response.status === 200) {
                // Afficher la modale
                const modal = document.getElementById("modal");
                modal.style.display = "flex";

                // Fermer la modale lorsque l'utilisateur clique sur "OK"
                document.getElementById("modal-ok").addEventListener("click", () => {
                    modal.style.display = "none";
                });

                // Fermer la modale lorsqu'on clique sur le bouton de fermeture
                document.getElementById("modal-close").addEventListener("click", () => {
                    modal.style.display = "none";
                });
            } else {
                console.log(response);
                alert("Erreur lors de l'ajout au panier.");
            }
        });
    });
});
