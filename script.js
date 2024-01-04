
    var undoStack = [];
    var redoStack = [];
    var offsetX, offsetY, isDragging = false;


    document.addEventListener('DOMContentLoaded', function () {
        saveState(); // Save the initial state
    });


    function startDragging(e) {
        var output = document.getElementById('output');
        offsetX = e.clientX - output.offsetLeft;
        offsetY = e.clientY - output.offsetTop;
        isDragging = true;
        document.addEventListener('mousemove', dragElement);
        document.addEventListener('mouseup', stopDragging);
        output.style.border = '0.1vw dotted black';
        e.preventDefault(); // Prevent default behavior to avoid text selection during drag
    }

    function dragElement(e) {
        if (isDragging) {
            var output = document.getElementById('output');
            var cont1 = document.querySelector('.cont-1');
            var maxX = cont1.clientWidth - output.clientWidth;
            var maxY = cont1.clientHeight - output.clientHeight;

            var newX = e.clientX - offsetX;
            var newY = e.clientY - offsetY;

            // Ensure the new position is within the boundaries
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            output.style.left = newX + 'px';
            output.style.top = newY + 'px';
        }
    }

    function stopDragging() {
        if (isDragging) {
            isDragging = false;
            saveState();
        }
        document.removeEventListener('mousemove', dragElement);
        document.removeEventListener('mouseup', stopDragging);
    }

    function updateText(input) {
        var output = document.getElementById('output');
        output.innerHTML = input.value;
        output.style.border = '0.1vw dotted black';
        updateTextProperties();
    }

    function updateTextProperties() {
        var output = document.getElementById('output');
        var fontSelect = document.getElementById('fontSelect');
        var fontSize = document.getElementById('fontSize');
        var fontColor = document.getElementById('fontColor');

        output.style.fontFamily = fontSelect.value;
        output.style.fontSize = fontSize.value + 'px';
        output.style.color = fontColor.value;
        saveState();
    }

    function saveState() {
        var output = document.getElementById('output');
        var textInput = document.getElementById('textInput');
        var fontSelect = document.getElementById('fontSelect');
        var fontSize = document.getElementById('fontSize');
        var fontColor = document.getElementById('fontColor');

        var state = {
            outputHTML: output.innerHTML,
            outputStyle: {
                left: output.style.left,
                top: output.style.top,
                fontFamily: output.style.fontFamily,
                fontSize: output.style.fontSize,
                color: output.style.color
            },
            textInputValue: textInput.value,
            fontSelectValue: fontSelect.value,
            fontSizeValue: fontSize.value,
            fontColorValue: fontColor.value
        };

        undoStack.push(state);
        redoStack = [];
        console.log(undoStack);
    }

    function undo() {
        if (undoStack.length > 1) {
            redoStack.push(undoStack.pop());
            var state = undoStack[undoStack.length - 1];
            restoreState(state);
        }
        console.log(undoStack);
    }

    function redo() {
        if (redoStack.length > 0) {
            var state = redoStack.pop();
            undoStack.push(state);
            restoreState(state);
        }
        console.log(undoStack);
    }

    function restoreState(state) {
        var output = document.getElementById('output');
        var textInput = document.getElementById('textInput');
        var fontSelect = document.getElementById('fontSelect');
        var fontSize = document.getElementById('fontSize');
        var fontColor = document.getElementById('fontColor');

        output.innerHTML = state.outputHTML;
        output.style.left = state.outputStyle.left;
        output.style.top = state.outputStyle.top;
        output.style.fontFamily = state.outputStyle.fontFamily;
        output.style.fontSize = state.outputStyle.fontSize;
        output.style.color = state.outputStyle.color;

        textInput.value = state.textInputValue;
        fontSelect.value = state.fontSelectValue;
        fontSize.value = state.fontSizeValue;
        fontColor.value = state.fontColorValue;
    }

    document.addEventListener('click', function (e) {
        var output = document.getElementById('output');
        if (!output.contains(e.target)) {
            output.style.border = 'none';
        }
    });
