document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("product-search");
    const products = document.querySelectorAll("#products .product");

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();

        products.forEach(function (product) {
            const productName = product.querySelector(".product-name").textContent.toLowerCase();

            if (productName.includes(searchTerm)) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    });

    const sortOptions = document.getElementById("sort-options");
    const productContainer = document.querySelector("#products .product-container");
    const productsArray = Array.from(products);

    sortOptions.addEventListener("change", function () {
        const selectedOption = sortOptions.value;

        productsArray.sort(function (productA, productB) {
            const nameA = productA.querySelector(".product-name").textContent.toLowerCase();
            const nameB = productB.querySelector(".product-name").textContent.toLowerCase();
            const priceA = parseFloat(productA.querySelector(".product-price").textContent.replace("$", ""));
            const priceB = parseFloat(productB.querySelector(".product-price").textContent.replace("$", ""));

            switch (selectedOption) {
                case "name-asc":
                    return nameA.localeCompare(nameB);
                case "name-desc":
                    return nameB.localeCompare(nameA);
                case "price-asc":
                    return priceA - priceB;
                case "price-desc":
                    return priceB - priceA;
                default:
                    return 0;
            }
        });

        productsArray.forEach(function (product) {
            productContainer.appendChild(product);
        });
    });
});
