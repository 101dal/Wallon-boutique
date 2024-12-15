document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const closeModalButton = document.querySelector(".close-btn");
    const uploadImagesButton = document.getElementById("upload-images");

    // Open modal
    document.querySelectorAll(".view-images").forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-product-id");
            const imagesIds = JSON.parse(button.getAttribute("images_ids"));
            openModal(productId, imagesIds);
        });
    });

    // Close modal
    closeModalButton.addEventListener("click", closeModal);

    // Save changes for product
    document.querySelectorAll(".save-product").forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-product-id");
            saveProductChanges(productId, button);
        });
    });

    // Delete product
    document.querySelectorAll(".delete-product").forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("data-product-id");
            confirmDeletion(productId);
        });
    });

    // Upload images
    uploadImagesButton.addEventListener("click", () => {
        const productId = modal.getAttribute("data-product-id");
        uploadImages(productId);
    });

    // Close modal if clicked outside
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Prevent closing when clicking inside the modal content
    const modalContent = document.querySelector(".modal-content");
    modalContent.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent the click from propagating to the modal
    });

    function openModal(productId, imagesIds) {
        const imageList = document.getElementById("image-list");
        imageList.innerHTML = "";
        modal.classList.remove("hidden");
        modal.setAttribute("data-product-id", productId);

        imagesIds.forEach(imageId => {
            const mainDiv = document.createElement("div");
            mainDiv.classList.add("image-list-element");
            mainDiv.setAttribute(`data-image-id`, imageId);


            const imgElement = document.createElement("img");
            imgElement.src = `http://localhost:3000/api/v1/images?product_id=${productId}&image_id=${imageId}`;
            imgElement.alt = "Product Image";
            imgElement.dataset.imageId = imageId;
            imgElement.addEventListener("click", async () => await removeImage(productId, imageId));

            const element = document.createElement("ion-icon");
            element.name = "trash-outline";
            element.classList.add("delete-icon");

            mainDiv.appendChild(imgElement);
            mainDiv.appendChild(element);
            imageList.appendChild(mainDiv);
        });
    }

    function closeModal() {
        modal.classList.add("hidden");
        modal.removeAttribute("data-product-id");
    }

    async function saveProductChanges(productId, button) {
        if (confirm("Etes-vous certain de vouloir changer ce produit, cette action est irréversible!")) {
            const productItem = document.querySelector(`.product-item[data-product-id='${productId}']`);
            const name = productItem.querySelector(".product-name").value;
            const description = productItem.querySelector(".product-description").value;
            const colors = productItem.querySelector(".product-colors").value;
            const sizes = productItem.querySelector(".product-sizes").value;
            const price = parseFloat(productItem.querySelector(".product-price").value);
            const inventory = parseInt(productItem.querySelector(".product-inventory").value, 10);
            const type = productItem.querySelector(".product-type").value;

            const response = await updateProduct_request(name, description, colors, sizes, price, inventory, type, productId);
            if (response.status === 200) {
                updateProductInDOM(response.content);
                button.classList.add("saved");
                button.querySelector("ion-icon").setAttribute("name", "checkmark-done-outline")
                setTimeout(() => {
                    button.querySelector("ion-icon").setAttribute("name", "save-outline")
                    button.classList.remove("saved");
                }, 1000);
            }
        }
    }

    async function confirmDeletion(productId) {
        if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
            const response = await deleteProduct_request(productId);
            if (response) {
                document.querySelector(`.product-item[data-product-id='${productId}']`).remove();
            }
        }
    }

    async function uploadImages(productId) {
        const newImagesInput = document.getElementById("new-images");
        const files = newImagesInput.files;

        if (files.length === 0) {
            alert("Veuillez sélectionner des images à télécharger.");
            return;
        }

        const response = await addImageToProduct_request(productId, newImagesInput);
        if (response.status === 200) {
            console.log(response)
            updateProductImagesInModal(productId, response.content.url);
        }
    }

    async function removeImage(productId, imageId) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
            const response = await removeImageFromProduct_request(productId, imageId);
            if (response) {
                const button = document.querySelector(`button.view-images[data-product-id='${productId}']`);
                const oldIds = JSON.parse(button.getAttribute("images_ids"));
                const newImagesIds = oldIds.filter(id => id !== imageId);
                console.log(oldIds, newImagesIds);
                button.setAttribute("images_ids", JSON.stringify(newImagesIds));
                document.querySelector(`div[data-image-id='${imageId}']`).remove();
            }
        }
    }

    function updateProductInDOM(product) {
        const productItem = document.querySelector(`.product-item[data-product-id='${product.id}']`);
        productItem.querySelector(".product-name").value = product.name;
        productItem.querySelector(".product-description").value = product.description;
        productItem.querySelector(".product-colors").value = product.colors ? product.colors.join(", ") : "";
        productItem.querySelector(".product-sizes").value = product.sizes ? product.sizes.join(", ") : "";
        productItem.querySelector(".product-price").value = product.price;
        productItem.querySelector(".product-inventory").value = product.inventory;
        productItem.querySelector(".product-type").value = product.type;
    }

    function updateProductImagesInModal(product_id, images) {
        const imageList = document.getElementById("image-list");
        imageList.innerHTML = "";

        console.log(images);

        const button = document.querySelector(`button.view-images[data-product-id='${product_id}']`);
        console.log(images);
        button.setAttribute("images_ids", JSON.stringify(images))

        

        images.forEach(imageId => {
            const mainDiv = document.createElement("div");
            mainDiv.classList.add("image-list-element");
            mainDiv.setAttribute(`data-image-id`, imageId);

            const imgElement = document.createElement("img");
            imgElement.src = `http://localhost:3000/api/v1/images?product_id=${product_id}&image_id=${imageId}`;
            imgElement.alt = "Product Image";
            imgElement.dataset.imageId = imageId;
            imgElement.addEventListener("click", async () => await removeImage(product_id, imageId));

            const element = document.createElement("ion-icon");
            element.name = "trash-outline";
            element.classList.add("delete-icon");

            mainDiv.appendChild(imgElement);
            mainDiv.appendChild(element);
            imageList.appendChild(mainDiv);
        });
    }

    // Backend communication functions

    async function updateProduct_request(name, description, colors, sizes, price, inventory, type, id) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("colors", colors);
        formData.append("sizes", sizes);
        formData.append("price", price);
        formData.append("inventory", inventory);
        formData.append("type", type);

        const response = await fetch(`http://localhost:3000/api/v1/products/update/${id}`, {
            method: "PATCH",
            credentials: "include",
            body: formData,
        });

        return await response.json();
    }

    async function deleteProduct_request(id) {
        const response = await fetch(`http://localhost:3000/api/v1/products/delete/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        return await response.json();
    }

    async function addImageToProduct_request(id, imagesFiles) {
        const formData = new FormData();
        for (const fileItem of imagesFiles.files) {
            formData.append("images", fileItem);
        }

        const response = await fetch(`http://localhost:3000/api/v1/products/add-images/${id}`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        return await response.json();
    }

    async function removeImageFromProduct_request(id, imageIndex) {
        const response = await fetch(`http://localhost:3000/api/v1/products/remove-image/${id}/${imageIndex}`, {
            method: "DELETE",
            credentials: "include",
        });

        return await response.json();
    }
});
