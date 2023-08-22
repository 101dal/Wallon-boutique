document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuButton = document.querySelector(".mobile-menu-button");
  const mobileMenuList = document.querySelector(".mobile-menu-list");

  mobileMenuButton.addEventListener("click", function () {
    mobileMenuList.classList.toggle("open");
    mobileMenuButton.classList.toggle("open"); /* Toggle open class on button */
  });
});