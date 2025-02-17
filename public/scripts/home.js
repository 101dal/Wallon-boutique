document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".slider-dot");
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide) => slide.classList.remove("active"));
        dots.forEach((dot) => dot.classList.remove("active"));

        slides[index].classList.add("active");
        dots[index].classList.add("active");
        currentSlide = index;
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => showSlide(index));
    });

    setInterval(() => {
        let nextSlide = (currentSlide + 1) % slides.length;
        showSlide(nextSlide);
    }, 5000);

    const burgerMenu = document.querySelector(".burger-menu");
    const navLinks = document.querySelectorAll(".nav-links");
    const overlay = document.querySelector(".menu-overlay");

    burgerMenu.addEventListener("click", () => {
        navLinks.forEach((nav) => nav.classList.toggle("active"));
        overlay.classList.toggle("active");

        const icon = burgerMenu.querySelector("ion-icon");
        const isOpen = icon.getAttribute("name") === "menu-outline";
        icon.setAttribute("name", isOpen ? "close-outline" : "menu-outline");
    });

    overlay.addEventListener("click", () => {
        navLinks.forEach((nav) => nav.classList.remove("active"));
        overlay.classList.remove("active");

        const icon = burgerMenu.querySelector("ion-icon");
        icon.setAttribute("name", "menu-outline");
    });
});
