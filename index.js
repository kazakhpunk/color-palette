// JavaScript чтобы обновлять цвета
function updateColor() {
    const hue = document.getElementById('hue').value;
    const saturation = document.getElementById('saturation').value;
    const lightness = document.getElementById('lightness').value;
    const alpha = document.getElementById('alpha').value;
    
    const color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    
    // Обновляет изображение цвета
    document.getElementById('color-preview').style.backgroundColor = color;
    
    // Обновляет инпут цвета
    document.getElementById('hsla').value = color;
    // ... Add logic to convert to HEX and RGBA
  }
  
  // Обновляет страницу в реальном времени
  document.querySelectorAll('#color-picker input[type=range]').forEach(input => {
    input.addEventListener('input', updateColor);
  });