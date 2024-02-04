const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
import { GoogleGenerativeAI } from "@google/generative-ai";

let userMessage = null; // Variable to store user's message
const API_KEY = "API_KEY"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = async (chatElement) => {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const main_prompt = "only provide precise answer, no extra information";
    const prompt = main_prompt + userMessage;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        const messageElement = chatElement.querySelector("p");
        messageElement.textContent = text.trim();
    } catch (error) {
        // Handle any errors that occur during processing
        const messageElement = chatElement.querySelector("p");
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    } finally {
        // Ensure the chatbox scrolls to the bottom
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
}


const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));



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
