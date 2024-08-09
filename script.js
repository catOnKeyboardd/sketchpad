const canvas = document.getElementById('paint-canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color-picker');
const brushSize = document.getElementById('brush-size');
const clearCanvas = document.getElementById('clear-canvas');
const toggleEraser = document.getElementById('toggle-eraser');
const downloadCanvas = document.getElementById('download-canvas');
const importImage = document.getElementById('import-image');

let painting = false;
let erasing = false;
let currentColor = colorPicker.value;
let currentBrushSize = brushSize.value;

canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 100;

// Off-screen canvas for color picking
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');
offscreenCanvas.width = canvas.width;
offscreenCanvas.height = canvas.height;

// Brush color
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
    if (!erasing) {
        ctx.strokeStyle = currentColor;
    }
});

// Brush size
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

// Import image to canvas
importImage.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Color match
function getColorAtPosition(x, y) {
    const pixel = offscreenCtx.getImageData(x, y, 1, 1).data;
    return `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
}

// Start action
canvas.addEventListener('mousedown', () => {
    painting = true;
});

// Stop action
canvas.addEventListener('mouseup', () => {
    painting = false;
    ctx.beginPath();
});

// Draw/Erase
canvas.addEventListener('mousemove', (e) => {
    if (painting) {
        ctx.lineWidth = currentBrushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = erasing ? '#FFFFFF' : currentColor;
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

        // Update offscreen canvas with current drawing
        offscreenCtx.drawImage(canvas, 0, 0);
    }
});

// Color pick
canvas.addEventListener('mousemove', (e) => {
    const x = e.clientX - canvas.offsetLeft;
    const y = e.clientY - canvas.offsetTop;
    currentColor = getColorAtPosition(x, y);
    if (!erasing) {
        ctx.strokeStyle = currentColor;
    }
});
