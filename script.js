document.addEventListener('DOMContentLoaded', function () {

    const runBtn = document.getElementById('runBtn');
    const resetBtn = document.getElementById('resetBtn');
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    const htmlEditor = document.getElementById('html-editor');
    const cssEditor = document.getElementById('css-editor');
    const jsEditor = document.getElementById('js-editor');
    const canvas = document.getElementById('output-canvas-element');
    const ctx = canvas.getContext('2d');

    var htmlEditorCodeMirror = CodeMirror.fromTextArea(htmlEditor, {
        mode: "htmlmixed",
        theme: "material",
        lineNumbers: true
    });
    var cssEditorCodeMirror = CodeMirror.fromTextArea(cssEditor, {
        mode: "css",
        theme: "material",
        lineNumbers: true
    });
    var jsEditorCodeMirror = CodeMirror.fromTextArea(jsEditor, {
        mode: "javascript",
        theme: "material",
        lineNumbers: true
    });

    const isDarkMode = true;
        const elementsToStyle = [document.body, runBtn, resetBtn, htmlEditor, cssEditor, jsEditor];

        elementsToStyle.forEach(element => {
            element.style.backgroundColor = isDarkMode ? '#333' : '#f4f4f4';
            element.style.color = isDarkMode ? '#fff' : '#000';
        });

        const headings = document.querySelectorAll('.editor-heading');
        headings.forEach(heading => {
            heading.classList.toggle('dark-mode', isDarkMode);
        });

    function runCode() {
        const htmlCode = htmlEditorCodeMirror.getValue();
        const cssCode = cssEditorCodeMirror.getValue();
        const jsCode = jsEditorCodeMirror.getValue();
        console.log(jsCode);
        // Create a new iframe to run the code in a sandbox
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';

        document.getElementById('output-canvas').innerHTML = ''; // Clear previous output
        document.getElementById('output-canvas').appendChild(iframe);

        // Access the document object of the iframe
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // Inject HTML, CSS, and JavaScript into the iframe
        iframeDocument.body.innerHTML = htmlCode;
        const styleElement = iframeDocument.createElement('style');
        styleElement.innerHTML = cssCode;
        iframeDocument.head.appendChild(styleElement);
        const scriptElement = iframeDocument.createElement('script');
        scriptElement.innerHTML = jsCode;
        console.log(scriptElement);
        iframeDocument.body.appendChild(scriptElement);
        console.log(iframeDocument);
    }

    function resetCode() {
        htmlEditorCodeMirror.setValue('');
        cssEditorCodeMirror.setValue('');
        jsEditorCodeMirror.setValue('');
        document.getElementById('output-canvas').innerHTML = '';
    }

    // Auto-run the code whenever the user finishes editing
    [htmlEditorCodeMirror, cssEditorCodeMirror, jsEditorCodeMirror].forEach(editor => {
        editor.on('change', runCodeDebounced);
    });

    // Initial run
    runCode();

    // Debounce function to delay code execution
    let debounceTimeout;
    function runCodeDebounced() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(runCode, 500); // Delayed execution after 500 milliseconds
    }

    // Reset button functionality
    resetBtn.addEventListener('click', resetCode);

});
