const themeToggle = document.querySelector('ion-icon[name="sunny-outline"]');


updateThemeIcon(currentTheme);

themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = document.querySelector(
        'ion-icon[name="sunny-outline"], ion-icon[name="moon-outline"]'
    );
    icon.setAttribute(
        "name",
        theme === "light" ? "moon-outline" : "sunny-outline"
    );
}
