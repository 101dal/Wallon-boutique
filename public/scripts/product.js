document.addEventListener("DOMContentLoaded", () => {
    const categoryButtons = document.querySelectorAll(".category-link");
    const products = document.querySelectorAll(".product-card");

    products.forEach((product) => product.classList.add("visible"));

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            categoryButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            const selectedCategory = button.dataset.category;

            products.forEach((product) => {
                if (
                    selectedCategory === "all" ||
                    product.dataset.category === selectedCategory
                ) {
                    product.classList.add("visible");
                } else {
                    product.classList.remove("visible");
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.getAttribute('data-product-id');
            if (productId) {
                window.location.href = `/products/${productId}`;
            }
        });
    });
});
