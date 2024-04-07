// Helper function to convert HSLA to RGBA
function hslaToRgba(h, s, l, a) {
    s /= 100;
    l /= 100;
  
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c/2,
        r = 0,
        g = 0,
        b = 0;
  
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
    // Calculate final RGB to be in the range [0, 255]
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
  
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  
  // Helper function to convert HSLA to HEX
  function hslaToHex(h, s, l, a) {
    const rgba = hslaToRgba(h, s, l, a);
    // Parse the RGBA output and use the existing RGB to HEX conversion
    const [r, g, b] = rgba.match(/\d+/g);
    return '#' + [r, g, b].map(x => {
      const hex = parseInt(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('') + Math.round(a * 255).toString(16).padStart(2, '0');
  }
  
  // JavaScript to update the color and values
  function updateColor() {
    const hue = document.getElementById('hue').value;
    const saturation = document.getElementById('saturation').value;
    const lightness = document.getElementById('lightness').value;
    const alpha = document.getElementById('alpha').value;
  
    const color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  
    // Update color preview
    document.getElementById('color-preview').style.backgroundColor = color;
  
    // Update text inputs
    document.getElementById('hsla').value = color;
    document.getElementById('rgba').value = hslaToRgba(hue, saturation, lightness, alpha);
    document.getElementById('hex').value = hslaToHex(hue, saturation, lightness, alpha);
  }
  
  // Attach event listeners to range inputs
  document.querySelectorAll('#color-picker input[type=range]').forEach(input => {
    input.addEventListener('input', updateColor);
  });
  