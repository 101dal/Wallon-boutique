function calculateAndApplyInvertedTextColor(element) {
    // Get the computed background color of the element
    const bgColor = getComputedStyle(element).backgroundColor;

    // Convert the background color to RGB values
    const rgbValues = bgColor.match(/\d+/g);
    const red = parseInt(rgbValues[0]);
    const green = parseInt(rgbValues[1]);
    const blue = parseInt(rgbValues[2]);

    // Calculate the brightness of the background color
    const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

    // Adjust the factor based on brightness
    const adjustmentFactor = brightness > 128 ? 1.2 : 0.8;

    // Calculate the inverted color with adjusted factor
    const invertedRed = Math.max(0, Math.min(255, 255 - red * adjustmentFactor));
    const invertedGreen = Math.max(0, Math.min(255, 255 - green * adjustmentFactor));
    const invertedBlue = Math.max(0, Math.min(255, 255 - blue * adjustmentFactor));

    // Create the inverted color string in CSS format
    const invertedColor = `rgb(${invertedRed}, ${invertedGreen}, ${invertedBlue})`;

    // Apply the inverted color to the CSS variable --navbar-text-color
    document.querySelector(':root').style.setProperty('--navbar-text-color', invertedColor);

    // Calculate and apply the inverted hover color
    const invertedHoverColor = brightness > 128 ? `rgb(${Math.min(255, red * 1.2)}, ${Math.min(255, green * 1.2)}, ${Math.min(255, blue * 1.2)})` :
                                                  `rgb(${Math.max(0, red * 0.8)}, ${Math.max(0, green * 0.8)}, ${Math.max(0, blue * 0.8)})`;

    // Apply the inverted hover color to the CSS variable --navbar-text-hover-color
    document.querySelector(':root').style.setProperty('--navbar-text-hover-color', invertedHoverColor);
}