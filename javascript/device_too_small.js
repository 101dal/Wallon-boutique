document.addEventListener("DOMContentLoaded", function () {
    // Check screen width and handle if too small
    const screenWidth = window.innerWidth;

    if (screenWidth < 335) {
        // Remove existing content and replace with a message
        document.body.innerHTML = "<h1>This website won't work on this device because the screen is too small.</h1>";
        
        // Display an alert message
        alert("This website won't work on this device because the screen is too small.");
    }
});
