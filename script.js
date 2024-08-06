const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const brushSize = document.getElementById('brush-size');
const clearCanvas = document.getElementById('clear-canvas');
const toggleEraser = document.getElementById('toggle-eraser');
const downloadCanvas = document.getElementById('download-canvas');

let painting = false;
let erasing = false;
let currentColor = colorPicker.value;
let currentBrushSize = brushSize.value;

// Set canvas size
canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 100;

// Update brush color
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    if (!erasing) {
        ctx.strokeStyle = currentColor;
    }
});

// Update brush size
brushSize.addEventListener('input', (e) => {
    currentBrushSize = e.target.value;
});

// Clear canvas
clearCanvas.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Toggle eraser
toggleEraser.addEventListener('click', () => {
    erasing = !erasing;
    if (erasing) {
        ctx.strokeStyle = '#FFFFFF'; 
        toggleEraser.textContent = 'Switch to Brush';
    } else {
        ctx.strokeStyle = currentColor;
        toggleEraser.textContent = 'Switch to Eraser';
    }
});

// Download canvas as image
downloadCanvas.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'drawing.png';
    link.click();
});

// Start painting or erasing
canvas.addEventListener('mousedown', () => {
    painting = true;
});

// Stop painting or erasing
canvas.addEventListener('mouseup', () => {
    painting = false;
    ctx.beginPath();
});

// Draw or erase on canvas
canvas.addEventListener('mousemove', (e) => {
    if (painting) {
        ctx.lineWidth = currentBrushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = erasing ? '#FFFFFF' : currentColor;
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }
});
