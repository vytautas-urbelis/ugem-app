// Helper function to convert HSL to RGB
function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}

// Helper function to convert RGB to HEX
function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

// Main function to generate the color palette in HEX format
export function generateColorPaletteHEX(h, s, l) {
  const palette = {};
  const steps = 4; // Number of steps for lighter and darker shades
  const stepAmount = 10; // Percentage to adjust lightness

  // Generate lighter colors
  for (let i = steps; i > 0; i--) {
    const lightness = Math.min(100, l + stepAmount * i);
    const { r, g, b } = hslToRgb(h, s, lightness);
    palette[`${steps * 100 - i * 100 + 100}`] = rgbToHex(r, g, b);
  }

  // Original color
  const originalColor = hslToRgb(h, s, l);
  palette["500"] = rgbToHex(originalColor.r, originalColor.g, originalColor.b);

  // Generate darker colors
  for (let i = 1; i <= steps; i++) {
    const lightness = Math.max(0, l - stepAmount * i);
    const { r, g, b } = hslToRgb(h, s, lightness);
    palette[`${i * 100 + 500}`] = rgbToHex(r, g, b);
  }

  return palette;
}
