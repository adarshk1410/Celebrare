var undoStack = [];
var redoStack = [];
var isDragging = false;

document.addEventListener('DOMContentLoaded', function () {
    addTextBox(); // Initialize with a default text box
    saveState(); // Save the initial state
});

function addTextBox() {
    var cont1 = document.querySelector('.cont-1');

    var newText = document.createElement('div');
    newText.classList.add('New-text');
    newText.innerText = 'New Text';
    newText.contentEditable = true;

    // Set default values for each text box
    newText.defaultValues = {
        fontFamily: 'Arial',
        fontSize: '16px',
        color: '#000000',
    };

    applyTextProperties(newText.defaultValues, newText.style);

    newText.addEventListener('mousedown', function (e) {
        selectTextBox(e.target);
        startDragging(e);
    });
    newText.addEventListener('input', function () {
        updateTextProperties();
    });

    cont1.appendChild(newText);

    // Set the newly added text box as the selectedText
    selectTextBox(newText);

    // Save state after adding text box
    saveState();
}

function applyTextProperties(properties, elementStyle) {
    elementStyle.fontFamily = properties.fontFamily;
    elementStyle.fontSize = properties.fontSize;
    elementStyle.color = properties.color;
}

function selectTextBox(textBox) {
    selectedText = textBox;
    var fontSelect = document.getElementById('fontSelect');
    (fontSelect.dataset.originalValue = selectedText.style.fontFamily || 'Arial').replace(/"/g, '');
    updateEditContainer();
}

function updateEditContainer() {
    var fontSelect = document.getElementById('fontSelect');
    var fontSize = document.getElementById('fontSize');
    var fontColor = document.getElementById('fontColor');
    var textInput = document.getElementById('textInput');

    if (selectedText && !isDragging) {
        fontSelect.value = (selectedText.style.fontFamily).replace(/"/g, '');
        fontSize.value = parseInt(selectedText.style.fontSize) || 16;
        fontColor.value = rgbToHex(selectedText.style.color || 'rgb(0, 0, 0)');
        textInput.value = selectedText.innerText; // Added to update text content in the edit container
    } else {
        // Set default values when no text is selected or when dragging
        fontSelect.value = '';
        fontSize.value = ''; // Update this line to handle the font size correctly
        fontColor.value = '#000000';
        textInput.value = ''; // Added to clear text content in the edit container when no text is selected
    }
}



function updateText(input) {
    if (selectedText) {
        selectedText.innerText = input.value;
        saveState();
    }
}

document.getElementById('textInput').addEventListener('input', function () {
    updateText(this);
});

function updateTextProperties() {
    if (selectedText) {
        selectedText.style.fontFamily = document.getElementById('fontSelect').value;
        selectedText.style.fontSize = document.getElementById('fontSize').value + 'px';
        selectedText.style.color = document.getElementById('fontColor').value;

        saveState();
    }
}

document.getElementById('fontSelect').addEventListener('change', function () {
    if (selectedText) {
        selectedText.style.fontFamily = this.value;
        saveState();
    }
});

function saveState() {
    if (selectedText) {
        var textProperties = {
            left: selectedText.style.left,
            top: selectedText.style.top,
            fontFamily: selectedText.style.fontFamily,
            fontSize: selectedText.style.fontSize, // Save fontSize as a string
            color: rgbToHex(selectedText.style.color || 'rgb(0, 0, 0)'),
            text: selectedText.innerText
        };

        undoStack.push(textProperties);
        redoStack = [];
        console.log('Saved state:', textProperties);
    }
}


function rgbToHex(rgb) {
    // Extract the individual RGB components
    var [r, g, b] = rgb.match(/\d+/g);

    // Convert to hex and pad with zeros if needed
    r = ('0' + parseInt(r).toString(16)).slice(-2);
    g = ('0' + parseInt(g).toString(16)).slice(-2);
    b = ('0' + parseInt(b).toString(16)).slice(-2);

    // Combine and return the hex color
    return `#${r}${g}${b}`;
}

function undo() {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        var textProperties = undoStack[undoStack.length - 1];
        restoreState(textProperties);
        updateEditContainer();
    }
    console.log(undoStack);
}

function redo() {
    if (redoStack.length > 0) {
        var textProperties = redoStack.pop();
        undoStack.push(textProperties);
        restoreState(textProperties);
        updateEditContainer();
    }
    console.log(undoStack);
}

function restoreState(textProperties) {
    if (selectedText) {
        selectedText.style.left = textProperties.left;
        selectedText.style.top = textProperties.top;
        applyTextProperties(textProperties, selectedText.style);
        selectedText.innerText = textProperties.text;
    }
}

document.addEventListener('mousedown', function (e) {
    selectTextBox(e.target);
});

function startDragging(e) {
    offsetX = e.clientX - selectedText.offsetLeft;
    offsetY = e.clientY - selectedText.offsetTop;
    isDragging = true;

    document.addEventListener('mousemove', dragSelectedText);
    document.addEventListener('mouseup', stopDragging);

    e.preventDefault();
}

function dragSelectedText(e) {
    if (isDragging) {
        var cont1 = document.querySelector('.cont-1');
        var maxX = cont1.clientWidth - selectedText.clientWidth;
        var maxY = cont1.clientHeight - selectedText.clientHeight;

        var newX = e.clientX - offsetX;
        var newY = e.clientY - offsetY;

        // Ensure the new position is within the boundaries
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        selectedText.style.left = newX + 'px';
        selectedText.style.top = newY + 'px';
    }
}

function stopDragging() {
    if (isDragging) {
        isDragging = false;

        document.removeEventListener('mousemove', dragSelectedText);
        document.removeEventListener('mouseup', stopDragging);

        // Save the state when dragging stops
        saveState();
    }
}
