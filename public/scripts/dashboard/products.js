async function createProduct_request(name, description, colors, sizes, price, inventory, type, imagesFiles) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('colors', colors);
    formData.append('sizes', sizes);
    formData.append('price', price);
    formData.append('inventory', inventory);
    formData.append('type', type);
    for (const fileItem of imagesFiles.files) {
        formData.append('images', fileItem);
    }
    const response = await fetch(`http://localhost:3000/api/v1/products/create`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    return data;
}

document.getElementById("add-product-form").addEventListener("submit", async event => {
    event.preventDefault();

    const name = document.getElementById("product-name").value;
    const type = document.getElementById("product-type").value;
    const price = document.getElementById("product-price").value;
    const description = document.getElementById("product-description").value;
    const inventory = document.getElementById("product-inventory").value;
    const colors = document.getElementById("product-colors").value;
    const sizes = document.getElementById("product-sizes").value;
    const images = document.getElementById("product-images");

    console.log(images);

    const response = await createProduct_request(name, description, colors, sizes, price, inventory, type, images);

    console.log(response)

    alert("FINISHED")
});

async function updateProduct_request(name, description, colors, sizes, price, inventory, type, id, imagesFiles) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('colors', colors);
    formData.append('sizes', sizes);
    formData.append('price', price);
    formData.append('inventory', inventory);
    formData.append('type', type);
    for (const fileItem of imagesFiles.files) {
        formData.append('images', fileItem);
    }
    const response = await fetch(`http://localhost:3000/api/v1/products/update/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
    });
    const data = await response.json();
    return data;
}

// Fonction pour ouvrir le dialogue de modification
function openEditDialog(productId) {
    const productCard = document.querySelector(`#product_change_${productId}`).closest(".product-card");

    // Préremplir les champs du formulaire de modification
    document.getElementById("edit-product-name").value = productCard.querySelector("h3").textContent;
    document.getElementById("edit-product-price").value = parseFloat(
        productCard.querySelector(".price").textContent.replace("Prix: ", "").replace("€", "")
    );
    document.getElementById("edit-product-description").value = productCard
        .querySelector(".description")
        .textContent.replace("Description: ", "");

    // Afficher le modal
    document.getElementById("edit-product-dialog").classList.remove("hidden");

    // Stocker l'ID du produit dans le formulaire
    document.getElementById("edit-product-form").dataset.productId = productId;
}

// Écouteur pour chaque bouton "Modifier"
document.querySelectorAll("[id^=product_change_]").forEach(button => {
    button.addEventListener("click", event => {
        const productId = button.id.replace("product_change_", "");
        openEditDialog(productId);
    });
});

// Fermer le dialogue via le bouton de fermeture
document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("edit-product-dialog").classList.add("hidden");
});

// Fermer le dialogue en cliquant hors du contenu
document.querySelector(".modal").addEventListener("click", event => {
    const modalContent = document.querySelector(".modal-content");
    if (!modalContent.contains(event.target)) {
        document.getElementById("edit-product-dialog").classList.add("hidden");
    }
});

// Gestion de la soumission du formulaire de modification
document.getElementById("edit-product-form").addEventListener("submit", async event => {
    event.preventDefault();

    // Récupérer les valeurs du formulaire
    const productId = event.target.dataset.productId;
    const name = document.getElementById("edit-product-name").value;
    const type = document.getElementById("edit-product-type").value;
    const price = document.getElementById("edit-product-price").value;
    const description = document.getElementById("edit-product-description").value;
    const inventory = document.getElementById("edit-product-inventory").value;
    const colors = document.getElementById("edit-product-colors").value;
    const sizes = document.getElementById("edit-product-sizes").value;
    const images = document.getElementById("edit-product-images");

    // Envoyer les modifications au serveur
    const response = await updateProduct_request(name, description, colors, sizes, price, inventory, type, productId, images);

    if (response.success) {
        alert("Produit mis à jour avec succès !");
        document.getElementById("edit-product-dialog").classList.add("hidden");
    } else {
        alert("Erreur lors de la mise à jour du produit.");
    }
});
