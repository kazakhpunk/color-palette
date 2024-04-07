function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs((h / 60) % 2 - 1)),
        m = l - c / 2,
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

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
}

function hslToHex(h, s, l) {
    const { r, g, b } = hslToRgb(h, s, l);
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function updateFromHex() {
    const hexValue = document.getElementById('hex').value;
    const { r, g, b } = hexToRgb(hexValue);
    const { h, s, l } = rgbToHsl(r, g, b);
    updateInterface(h, s, l);
}

function updateFromRgb() {
    const rgbValue = document.getElementById('rgb').value;
    const parts = rgbValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (parts) {
        const r = parseInt(parts[1], 10);
        const g = parseInt(parts[2], 10);
        const b = parseInt(parts[3], 10);
        const { h, s, l } = rgbToHsl(r, g, b);
        updateInterface(h, s, l);
    }
}

function updateFromHsl() {
    const hslValue = document.getElementById('hsl').value;
    const parts = hslValue.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (parts) {
        const h = parseInt(parts[1], 10);
        const s = parseInt(parts[2], 10);
        const l = parseInt(parts[3], 10);
        updateInterface(h, s, l);
    }
}

function updateInterface(h, s, l) {
    document.getElementById('hue').value = h;
    document.getElementById('saturation').value = s;
    document.getElementById('lightness').value = l;

    const hslColor = `hsl(${h}, ${s}%, ${l}%)`;
    document.getElementById('color-preview').style.backgroundColor = hslColor;
    document.getElementById('hsl').value = hslColor;

    const { r, g, b } = hslToRgb(h, s, l);
    document.getElementById('rgb').value = `rgb(${r}, ${g}, ${b})`;

    const hexColor = hslToHex(h, s, l);
    document.getElementById('hex').value = hexColor;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.color-picker input[type=range]').forEach(input => {
        input.addEventListener('input', () => {
            const h = parseInt(document.getElementById('hue').value);
            const s = parseInt(document.getElementById('saturation').value);
            const l = parseInt(document.getElementById('lightness').value);
            updateInterface(h, s, l);
        });
    });

    document.getElementById('hex').addEventListener('input', updateFromHex);
    document.getElementById('rgb').addEventListener('input', updateFromRgb);
    document.getElementById('hsl').addEventListener('input', updateFromHsl);
});
