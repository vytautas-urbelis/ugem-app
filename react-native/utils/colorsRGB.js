// Helper function to convert HSL to RGB
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
  
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
  
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
  
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
  
    // return [r, g, b ] ;
    return `${r} ${g} ${b}`
  }
  
  // Main function to generate the color palette
  export function generateColorPalette(h, s, l) {
    const palette = {};
    const steps = 4; // Number of steps for lighter and darker shades
    const stepAmount = 10; // Percentage to adjust lightness
  
    // Generate lighter colors
    for (let i = steps; i > 0; i--) {
      const lightness = Math.min(100, l + stepAmount * i);
      palette[`${steps * 100 - i * 100 + 100}`] = hslToRgb(h, s, lightness);
    }
  
    // Original color
    palette['500'] = hslToRgb(h, s, l);
  
    // Generate darker colors
    for (let i = 1; i <= steps; i++) {
      const lightness = Math.max(0, l - stepAmount * i);
      palette[`${i*100 + 500}`] = hslToRgb(h, s, lightness);
    }
  
    return palette;
  }
  
//   // Example usage
//   const hslColor = { h: 200, s: 50, l: 50 }; // HSL color input
//   const colorPalette = generateColorPalette(hslColor.h, hslColor.s, hslColor.l);
//   console.log(colorPalette);
  