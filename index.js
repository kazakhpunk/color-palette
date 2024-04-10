
function convertHSLToRGB(hue, saturation, lightness) {
    saturation /= 100;
    lightness /= 100;

    let chroma = (1 - Math.abs(2 * lightness - 1)) * saturation,
        x = chroma * (1 - Math.abs((hue / 60) % 2 - 1)),
        m = lightness - chroma / 2,
        red = 0,
        green = 0,
        blue = 0;

    if (0 <= hue && hue < 60) {
        red = chroma; green = x; blue = 0;  
    } else if (60 <= hue && hue < 120) {
        red = x; green = chroma; blue = 0;
    } else if (120 <= hue && hue < 180) {
        red = 0; green = chroma; blue = x;
    } else if (180 <= hue && hue < 240) {
        red = 0; green = x; blue = chroma;
    } else if (240 <= hue && hue < 300) {
        red = x; green = 0; blue = chroma;
    } else if (300 <= hue && hue < 360) {
        red = chroma; green = 0; blue = x;
    }

    red = Math.round((red + m) * 255);
    green = Math.round((green + m) * 255);
    blue = Math.round((blue + m) * 255);

    return { red, green, blue };
}

function convertHSLToHex(hue, saturation, lightness) {
    const { red, green, blue } = convertHSLToRGB(hue, saturation, lightness);
    return "#" + [red, green, blue].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function convertHexToRGB(hex) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const red = (bigint >> 16) & 255;
    const green = (bigint >> 8) & 255;
    const blue = bigint & 255;

    return { red, green, blue };
}

function convertRGBToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function convertRGBToHSL(red, green, blue) {
    red /= 255;
    green /= 255;
    blue /= 255;

    const max = Math.max(red, green, blue), min = Math.min(red, green, blue);
    let hue, saturation, lightness = (max + min) / 2;

    if (max === min) {
        hue = saturation = 0;
    } else {
        const delta = max - min;
        saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        switch (max) {
            case red: hue = (green - blue) / delta + (green < blue ? 6 : 0); break;
            case green: hue = (blue - red) / delta + 2; break;
            case blue: hue = (red - green) / delta + 4; break;
        }
        hue /= 6;
    }

    return { hue: Math.round(hue * 360), saturation: Math.round(saturation * 100), lightness: Math.round(lightness * 100) };
}

function updateFromHex() {
    const hexValue = document.getElementById('hex').value;
    const { red, green, blue } = convertHexToRGB(hexValue);
    const { hue, saturation, lightness } = convertRGBToHSL(red, green, blue);
    updateInterface(hue, saturation, lightness);
}

function updateFromRGB() {
    const rgbValue = document.getElementById('rgb').value;
    const parts = rgbValue.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (parts) {
        const red = parseInt(parts[1], 10);
        const green = parseInt(parts[2], 10);
        const blue = parseInt(parts[3], 10);
        const { hue, saturation, lightness } = convertRGBToHSL(red, green, blue);
        updateInterface(hue, saturation, lightness);
    }
}

function updateFromHSL() {
    const hslValue = document.getElementById('hsl').value;
    const parts = hslValue.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (parts) {
        const hue = parseInt(parts[1], 10);
        const saturation = parseInt(parts[2], 10);
        const lightness = parseInt(parts[3], 10);
        updateInterface(hue, saturation, lightness);
    }
}

function updateInterface(hue, saturation, lightness) {
    document.getElementById('hue').value = hue;
    document.getElementById('saturation').value = saturation;
    document.getElementById('lightness').value = lightness;

    const hslColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    document.getElementById('color-preview').style.backgroundColor = hslColor;
    document.getElementById('hsl').value = hslColor;

    const { red, green, blue } = convertHSLToRGB(hue, saturation, lightness);
    document.getElementById('rgb').value = `rgb(${red}, ${green}, ${blue})`;

    const hexColor = convertHSLToHex(hue, saturation, lightness);
    document.getElementById('hex').value = hexColor;

    updateComplementaryShades(hexColor)

}

function resetColor() {
    updateInterface(0, 100, 50);
}

function displayPalette(hexValue) {
    console.log("Palette selected:", hexValue); // Debugging line
    document.getElementById('color-preview').style.backgroundColor = hexValue;
    const { red, green, blue } = convertHexToRGB(hexValue);
    const { hue, saturation, lightness } = convertRGBToHSL(red, green, blue);

    document.getElementById('hue').value = hue;
    document.getElementById('saturation').value = saturation;
    document.getElementById('lightness').value = lightness;

    document.getElementById('hex').value = hexValue;
    document.getElementById('rgb').value = `rgb(${red}, ${green}, ${blue})`;
    document.getElementById('hsl').value = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    updateComplementaryShades(hexValue);
}

function storageClick(hexValue) {
    console.log(storageValue);
    displayPalette(hexValue);

}

function complementaryClick(rgbValue) {
    console.log(rgbValue);
    const rgbMatch = rgbValue.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    let hexValue = rgbValue;
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        hexValue = convertRGBToHex(r, g, b);
    }

    displayPalette(hexValue);
}

function saveColor() {
    const selectedColor = document.getElementById('color-preview').style.backgroundColor;
    const rgbMatch = selectedColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    let hexColor = selectedColor;
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        hexColor = convertRGBToHex(r, g, b);
    }

    const palettes = document.querySelectorAll('.stored-palettes .color');
    const emptyPalette = Array.from(palettes).find(palette => !palette.style.backgroundColor);
    if (emptyPalette) {
        emptyPalette.style.backgroundColor = hexColor;
        emptyPalette.setAttribute('onclick', `displayPalette('${hexColor}')`);
        emptyPalette.dataset.color = hexColor; 
    } else {
        console.log('No available empty palettes.');
    }
}

function deleteColor() {
    const filledPalettes = Array.from(document.querySelectorAll('.stored-palettes .color'))
                                .filter(palette => palette.style.backgroundColor !== '');
    
    if (filledPalettes.length > 0) {
        const lastFilledPalette = filledPalettes[filledPalettes.length - 1];
        lastFilledPalette.style.backgroundColor = ''; 
        lastFilledPalette.removeAttribute('onclick'); 
    } else {
        console.log('No colors to delete.');
    }
}

function generateComplementaryShades(hue, saturation, lightness) {
    let complementaryShade1 = (hue + 90) % 360;
    let complementaryShade2 = (hue + 180) % 360;
    let complementaryShade3 = (hue + 270) % 360;
 
    return [
        convertHSLToHex(complementaryShade1, saturation, lightness),
        convertHSLToHex(complementaryShade2, saturation, lightness),
        convertHSLToHex(complementaryShade3, saturation, lightness)
    ];
}

function updateComplementaryShades(hexValue) {
    const { red, green, blue } = convertHexToRGB(hexValue);
    const { hue, saturation, lightness } = convertRGBToHSL(red, green, blue);
    
    const complementaryHexShades = generateComplementaryShades(hue, saturation, lightness);

    document.getElementById('complementary1').style.backgroundColor = complementaryHexShades[0];
    document.getElementById('complementary2').style.backgroundColor = complementaryHexShades[1];
    document.getElementById('complementary3').style.backgroundColor = complementaryHexShades[2];
}


document.querySelectorAll('.stored-palettes .color').forEach(color => {
    color.addEventListener('click', () => {
        color.classList.toggle('selected');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.color-picker input[type=range]').forEach(input => {
        input.addEventListener('input', () => {
            const hue = parseInt(document.getElementById('hue').value);
            const saturation = parseInt(document.getElementById('saturation').value);
            const lightness = parseInt(document.getElementById('lightness').value);
            updateInterface(hue, saturation, lightness);
        });
    });

    document.getElementById('hex').addEventListener('input', updateFromHex);
    document.getElementById('rgb').addEventListener('input', updateFromRGB);
    document.getElementById('hsl').addEventListener('input', updateFromHSL);
});