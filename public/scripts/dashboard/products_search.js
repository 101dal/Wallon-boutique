document.addEventListener("DOMContentLoaded", () => {
    const filterName = document.getElementById("filter-name");
    const filterType = document.getElementById("filter-type");
    const filterPriceMin = document.getElementById("filter-price-min");
    const filterPriceMax = document.getElementById("filter-price-max");
    const filterSort = document.getElementById("filter-sort");
    const applyFiltersButton = document.getElementById("apply-filters");
    const productList = document.querySelector(".product-list");

    const applyFilters = () => {
        const name = filterName.value.toLowerCase().trim();
        const type = filterType.value.toLowerCase().trim();
        const priceMin = filterPriceMin.value === "" ? 0 : parseFloat(filterPriceMin.value);
        const priceMax = filterPriceMax.value === "" ? Infinity : parseFloat(filterPriceMax.value);
        const sortBy = filterSort.value;

        let products = Array.from(productList.querySelectorAll(".product-item"));

        // Reset visibility of all products
        products.forEach(product => {
            product.classList.remove("hidden"); // Remove hidden class for all products
        });

        // Filter products
        products.forEach(product => {
            const productName = product.querySelector(".product-name").value.toLowerCase();
            const productType = product.querySelector(".product-type").value.toLowerCase();
            const productPrice = parseFloat(product.querySelector(".product-price").value);

            const matchesName = name ? productName.includes(name) : true;
            const matchesType = type ? productType.includes(type) : true;
            const matchesPrice = productPrice >= priceMin && productPrice <= priceMax;

            // If the product does not match the filter, hide it
            if (!(matchesName && matchesType && matchesPrice)) {
                product.classList.add("hidden");
            }
        });

        // Sort products
        products = products.filter(product => !product.classList.contains("hidden")); // Filter out hidden products
        products.sort((a, b) => {
            if (sortBy === "name") {
                return a.querySelector(".product-name").value.localeCompare(b.querySelector(".product-name").value);
            } else if (sortBy === "price") {
                return parseFloat(a.querySelector(".product-price").value) - parseFloat(b.querySelector(".product-price").value);
            } else if (sortBy === "type") {
                return a.querySelector(".product-type").value.localeCompare(b.querySelector(".product-type").value);
            }
            return 0;
        });

        // Update the product list display (sorting still keeps the hiding logic)
        products.forEach(product => productList.appendChild(product));
    };

    applyFiltersButton.addEventListener("click", applyFilters);
});
