export function getRatingColor(rating) {
  // Clamp the rating between 35 and 90
  const minRating = 35;
  const maxRating = 90;
  rating = Math.max(minRating, Math.min(maxRating, rating));

  // Normalize the rating to a value between 0 and 1
  const normalizedRating = (rating - minRating) / (maxRating - minRating);

  // Red RGB: (255, 0, 0)
  const red = 255;
  const green = 0;
  const blue = 0;

  // Green RGB: (0, 255, 0)
  const redGreen = 0;
  const greenGreen = 255;
  const blueGreen = 0;

  // Linearly interpolate between red and green based on normalized rating
  const r = Math.round(red + (redGreen - red) * normalizedRating);
  const g = Math.round(green + (greenGreen - green) * normalizedRating);
  const b = Math.round(blue + (blueGreen - blue) * normalizedRating);

  const hexColor = rgbToHex(r, g, b);
  // Return the color in CSS rgb format
  return hexColor;
}

//   // Example usage:
//   const rating = 50; // Replace with your rating
//   const color = getRatingColor(rating);
//   console.log(color); // This will return a color between red and green based on the rating

function rgbToHex(r, g, b) {
  // Convert each color component to hexadecimal
  const toHex = (color) => {
    const hex = color.toString(16); // Convert to hex
    return hex.length === 1 ? "0" + hex : hex; // Pad with 0 if it's a single character
  };

  // Return the concatenated hex string
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
