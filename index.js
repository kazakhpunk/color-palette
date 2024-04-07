// Преобразование HSL в RGB
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

    // Конвертация в диапазон [0, 255]
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
}

// Преобразование HSL в HEX (исправлено для работы с объектом RGB)
function hslToHex(h, s, l) {
    const {r, g, b} = hslToRgb(h, s, l); // Используем деструктуризацию для получения r, g, b
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function updateColor() {
    const hue = document.getElementById('hue').value;
    const saturation = document.getElementById('saturation').value;
    const lightness = document.getElementById('lightness').value;
    
    // Убираем альфа-канал, используя только HSL
    const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    document.getElementById('color-preview').style.backgroundColor = hslColor;
    document.getElementById('hsl').value = hslColor; // Обновляем HSL значение
    
    const rgbObj = hslToRgb(hue, saturation, lightness);
    const rgbColor = `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`;
    document.getElementById('rgb').value = rgbColor; // Обновляем RGB значение

    const hexColor = hslToHex(hue, saturation, lightness);
    document.getElementById('hex').value = hexColor; // Обновляем HEX значение
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelectorAll('.color-picker input[type=range]').forEach(input => {
        input.addEventListener('input', updateColor);
    });
});
