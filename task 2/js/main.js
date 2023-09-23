let canvas = document.getElementById('memeCanvas');
let ctx = canvas.getContext('2d');
let textBlocks = []; // массив для текстовых блоков
let selectedTextBlock = null; // текущий текстовый блок
let drag = false; // флаг для перетаскивания текстового блока
let offsetX = 0; // смещение по х при перетаскивании
let offsetY = 0; // смещение по у при перетаскивании
let backgroundImg = new Image();

// функция для очистки холста
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// функция для отрисовки фонового изображения
function drawBackground() {
    clearCanvas();
    ctx.drawImage(backgroundImg, 0, 0);
}

// функция для отрисовки текстового блока
function drawTextBlock(textBlock) {
    ctx.font = textBlock.fontSize + "px Arial";
    ctx.textAlign = "center";
    if (textBlock.backgroundColor) {
        const padding = 8;
        const textWidth = ctx.measureText(textBlock.text).width;
        const textHeight = textBlock.fontSize;
        const rectX = textBlock.x - textWidth / 2 - padding;
        const rectY = textBlock.y - textHeight / 2 - padding;
        const rectWidth = textWidth + 2 * padding;
        const rectHeight = textHeight;

        ctx.fillStyle = textBlock.backgroundColor;
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
    }
    ctx.fillStyle = textBlock.fontColor;
    ctx.fillText(textBlock.text, textBlock.x, textBlock.y);
}

document.getElementById('imageUpload').addEventListener('change', handleImage, false);

function handleImage(e) {
    let reader = new FileReader();
    reader.onload = function(event){
        backgroundImg.onload = function(){
            canvas.width = backgroundImg.width;
            canvas.height = backgroundImg.height;
            drawBackground();
            generateMeme(); // перерисовываем текстовые блоки после загрузки фонового изображения
        }
        backgroundImg.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);     
}

function generateMeme() {
    // очищаем холст и отрисовываем фоновое изображение
    drawBackground();

    // отрисовываем текстовые блоки
    for (let i = 0; i < textBlocks.length; i++) {
        let textBlock = textBlocks[i];
        drawTextBlock(textBlock);
    }
}


function downloadMeme() {
    let link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL();
    link.click();
}

// функция для создания нового текстового блока
function createTextBlock(text, x, y, fontSize, fontColor, backgroundColor) {
    textBlocks.push({
        text: text,
        x: x,
        y: y,
        fontSize: fontSize,
        fontColor: fontColor,
        backgroundColor: backgroundColor
    });
    generateMeme();
}

// обработчик события для добавления нового текстового блока
function addTextBlock() {
    let text = document.getElementById('text').value;
    if (text) {
        let x = canvas.width / 2;
        let y = canvas.height / 2;
        let fontSize = parseInt(document.getElementById('fontSize').value);
        let fontColor = document.getElementById('fontColor').value;
        let backgroundColor = document.getElementById('backgroundColor').value;
        if (isNaN(fontSize)) {
            fontSize = 30;
        }
        if (!fontColor) {
            fontColor = "#000000";
        }
        createTextBlock(text, x, y, fontSize, fontColor, backgroundColor);
    }
}

// обработчик события для выбора текстового блока
canvas.addEventListener('mousedown', function(e) {
    drag = false;
    let mouseX = e.clientX - canvas.getBoundingClientRect().left;
    let mouseY = e.clientY - canvas.getBoundingClientRect().top;
    for (let i = textBlocks.length - 1; i >= 0; i--) {
        let textBlock = textBlocks[i];
        let textWidth = ctx.measureText(textBlock.text).width;
        if (
            mouseX > textBlock.x - textWidth / 2 &&
            mouseX < textBlock.x + textWidth / 2 &&
            mouseY > textBlock.y - textBlock.fontSize / 2 &&
            mouseY < textBlock.y + textBlock.fontSize / 2
        ) {
            selectedTextBlock = textBlock;
            offsetX = mouseX - selectedTextBlock.x;
            offsetY = mouseY - selectedTextBlock.y;
            drag = true;
            break;
        }
    }
});

// обработчик события для перемещения выбранного текстового блока
canvas.addEventListener('mousemove', function(e) {
    if (drag && selectedTextBlock) {
        let mouseX = e.clientX - canvas.getBoundingClientRect().left;
        let mouseY = e.clientY - canvas.getBoundingClientRect().top;
        selectedTextBlock.x = mouseX - offsetX;
        selectedTextBlock.y = mouseY - offsetY;
        generateMeme();
    }
});

// обработчик события для отпускания выбранного текстового блока
canvas.addEventListener('mouseup', function() {
    drag = false;
    selectedTextBlock = null;
});

// добавляем текстовый блок
document.getElementById('addText').addEventListener('click', addTextBlock);

function deleteTextBlock(index) {
    if (index >= 0 && index < textBlocks.length) {
        textBlocks.splice(index, 1); // удаляем элемент из массива
        generateMeme(); // перерисовываем холст 
    }
}

window.addEventListener('keydown', function(event) {
    if ((event.key === 'Backspace' || event.key === 'Delete') && selectedTextBlock) {
        const index = textBlocks.indexOf(selectedTextBlock); // находим индекс выбранного текстового блока
        deleteTextBlock(index); // вызываем функцию удаления
        selectedTextBlock = null; // сбрасываем выбранный текстовый блок
    }
});



generateMeme();