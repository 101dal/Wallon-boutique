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