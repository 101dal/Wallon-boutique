const togglePasswordButtons = document.querySelectorAll(".toggle-password");

togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const input = this.previousElementSibling;
        const icon = this.querySelector("ion-icon");

        if (input.type === "password") {
            input.type = "text";
            icon.setAttribute("name", "eye-off-outline");
        } else {
            input.type = "password";
            icon.setAttribute("name", "eye-outline");
        }
    });
});
