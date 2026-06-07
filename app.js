/* ==========================================
   SMARTX AI
   Made By Muhammad Hasan AI
   APP.JS - PART 1
   ========================================== */

/* ==========================================
   ELEMENTS
   ========================================== */

const chatMessages = document.getElementById("chatMessages");
const welcomeScreen = document.getElementById("welcomeScreen");

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");
const saveSettings = document.getElementById("saveSettings");

const apiKeyInput = document.getElementById("apiKeyInput");
const modelSelect = document.getElementById("modelSelect");

const themeSelect = document.getElementById("themeSelect");

const themeBtn = document.getElementById("themeBtn");
const themePanel = document.getElementById("themePanel");

const charCount = document.getElementById("charCount");

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const sidebar = document.getElementById("sidebar");

const newChatBtn = document.getElementById("newChatBtn");

const typingIndicator =
document.getElementById("typingIndicator");

const historyContainer =
document.getElementById("chatHistory");

/* ==========================================
   STORAGE KEYS
   ========================================== */

const STORAGE = {
    API_KEY: "smartx_api_key",
    MODEL: "smartx_model",
    THEME: "smartx_theme",
    CHATS: "smartx_chats",
    CURRENT_CHAT: "smartx_current_chat"
};

/* ==========================================
   APP STATE
   ========================================== */

let currentChatId = null;

let chats = {};

let settings = {
    apiKey: "",
    model: "openai/gpt-4o-mini",
    theme: "aurora"
};

/* ==========================================
   LOAD SETTINGS
   ========================================== */

function loadSettings(){

    settings.apiKey =
    localStorage.getItem(STORAGE.API_KEY) || "";

    settings.model =
    localStorage.getItem(STORAGE.MODEL)
    || "openai/gpt-4o-mini";

    settings.theme =
    localStorage.getItem(STORAGE.THEME)
    || "aurora";

    apiKeyInput.value =
    settings.apiKey;

    modelSelect.value =
    settings.model;

    themeSelect.value =
    settings.theme;

    applyTheme(settings.theme);
}

/* ==========================================
   SAVE SETTINGS
   ========================================== */

function saveAppSettings(){

    settings.apiKey =
    apiKeyInput.value.trim();

    settings.model =
    modelSelect.value;

    settings.theme =
    themeSelect.value;

    localStorage.setItem(
    STORAGE.API_KEY,
    settings.apiKey
    );

    localStorage.setItem(
    STORAGE.MODEL,
    settings.model
    );

    localStorage.setItem(
    STORAGE.THEME,
    settings.theme
    );

    applyTheme(settings.theme);

    settingsModal.classList.add("hidden");

    showToast("Settings Saved");
}

/* ==========================================
   APPLY THEME
   ========================================== */

function applyTheme(theme){

    document.body.classList.remove(
    "theme-aurora",
    "theme-cyberpunk",
    "theme-neon",
    "theme-galaxy",
    "theme-glass"
    );

    document.body.classList.add(
    `theme-${theme}`
    );

    localStorage.setItem(
    STORAGE.THEME,
    theme
    );
}

/* ==========================================
   THEME CARDS
   ========================================== */

document
.querySelectorAll(".theme-card")
.forEach(card => {

    card.addEventListener(
    "click",
    () => {

        const theme =
        card.dataset.theme;

        themeSelect.value =
        theme;

        applyTheme(theme);
    });

});

/* ==========================================
   MODAL EVENTS
   ========================================== */

settingsBtn.addEventListener(
"click",
() => {

    settingsModal
    .classList
    .remove("hidden");

});

closeSettings.addEventListener(
"click",
() => {

    settingsModal
    .classList
    .add("hidden");

});

saveSettings.addEventListener(
"click",
saveAppSettings
);

/* ==========================================
   THEME PANEL
   ========================================== */

themeBtn.addEventListener(
"click",
() => {

    themePanel
    .classList
    .toggle("hidden");

});

/* ==========================================
   CHARACTER COUNTER
   ========================================== */

messageInput.addEventListener(
"input",
() => {

    charCount.textContent =
    `${messageInput.value.length} Characters`;

    autoResizeTextarea();

});

/* ==========================================
   AUTO RESIZE
   ========================================== */

function autoResizeTextarea(){

    messageInput.style.height =
    "auto";

    messageInput.style.height =
    messageInput.scrollHeight + "px";
}

/* ==========================================
   MOBILE SIDEBAR
   ========================================== */

mobileMenuBtn.addEventListener(
"click",
() => {

    sidebar.classList
    .toggle("show");

});

document.addEventListener(
"click",
(e) => {

    if(
        window.innerWidth <= 900 &&
        !sidebar.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
    ){

        sidebar.classList
        .remove("show");
    }

});

/* ==========================================
   CHAT STORAGE
   ========================================== */

function saveChats(){

    localStorage.setItem(
    STORAGE.CHATS,
    JSON.stringify(chats)
    );

    localStorage.setItem(
    STORAGE.CURRENT_CHAT,
    currentChatId
    );
}

function loadChats(){

    const stored =
    localStorage.getItem(
    STORAGE.CHATS
    );

    chats =
    stored
    ? JSON.parse(stored)
    : {};

    currentChatId =
    localStorage.getItem(
    STORAGE.CURRENT_CHAT
    );
}

/* ==========================================
   CREATE CHAT
   ========================================== */

function createNewChat(){

    const id =
    "chat_" + Date.now();

    chats[id] = {
        id,
        title:"New Chat",
        created:new Date()
        .toISOString(),
        messages:[]
    };

    currentChatId = id;

    saveChats();

    renderHistory();

    clearChatWindow();
}

/* ==========================================
   CLEAR UI CHAT
   ========================================== */

function clearChatWindow(){

    chatMessages.innerHTML = "";

    welcomeScreen.style.display =
    "flex";
}

/* ==========================================
   RENDER HISTORY
   ========================================== */

function renderHistory(){

    historyContainer.innerHTML = "";

    Object.values(chats)
    .reverse()
    .forEach(chat => {

        const item =
        document.createElement("div");

        item.className =
        "history-item";

        if(
        chat.id === currentChatId
        ){
            item.classList.add(
            "active"
            );
        }

        item.innerHTML = `
        <div class="history-title-text">
        ${chat.title}
        </div>

        <div class="history-date">
        ${new Date(
        chat.created
        ).toLocaleDateString()}
        </div>
        `;

        item.addEventListener(
        "click",
        () => {

            openChat(chat.id);

        });

        historyContainer
        .appendChild(item);

    });

}

/* ==========================================
   OPEN CHAT
   ========================================== */

function openChat(chatId){

    currentChatId = chatId;

    saveChats();

    renderHistory();

    clearChatWindow();

    welcomeScreen.style.display =
    "none";

    const messages =
    chats[chatId].messages;

    messages.forEach(msg => {

        renderStoredMessage(msg);

    });

}

/* ==========================================
   NEW CHAT BUTTON
   ========================================== */

newChatBtn.addEventListener(
"click",
createNewChat
);

/* ==========================================
   TOAST
   ========================================== */

function showToast(text){

    const toast =
    document.createElement("div");

    toast.textContent =
    text;

    toast.style.position =
    "fixed";

    toast.style.bottom =
    "25px";

    toast.style.right =
    "25px";

    toast.style.padding =
    "12px 18px";

    toast.style.borderRadius =
    "14px";

    toast.style.background =
    "rgba(0,0,0,.8)";

    toast.style.color =
    "#fff";

    toast.style.zIndex =
    "99999";

    document.body
    .appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 2500);
}

/* ==========================================
   PARTICLES JS
   ========================================== */

if(window.particlesJS){

particlesJS("particles-js",{

particles:{
number:{
value:60
},

color:{
value:"#ffffff"
},

shape:{
type:"circle"
},

opacity:{
value:0.2
},

size:{
value:3
},

move:{
enable:true,
speed:1
},

line_linked:{
enable:true,
opacity:0.1
}
}

});

}

/* ==========================================
   INIT
   ========================================== */

loadSettings();

loadChats();

if(
!currentChatId ||
!chats[currentChatId]
){
    createNewChat();
}
else{
    renderHistory();
    openChat(currentChatId);
}

/* ==========================================
   SMARTX AI
   APP.JS - PART 2
   Message Rendering System
   ========================================== */

/* ==========================================
   ESCAPE HTML
   ========================================== */

function escapeHtml(text){

    const div =
    document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

/* ==========================================
   CREATE MESSAGE OBJECT
   ========================================== */

function createMessage(role, content){

    return {
        role,
        content,
        timestamp: Date.now()
    };
}

/* ==========================================
   MARKDOWN RENDER
   ========================================== */

function parseMarkdown(text){

    try{

        if(window.marked){

            return marked.parse(text);

        }

        return escapeHtml(text);

    }catch(err){

        console.error(err);

        return escapeHtml(text);

    }

}

/* ==========================================
   COPY TO CLIPBOARD
   ========================================== */

async function copyMessage(text){

    try{

        await navigator.clipboard.writeText(text);

        showToast("Copied");

    }catch(err){

        console.error(err);

        showToast("Copy Failed");

    }

}

/* ==========================================
   MESSAGE ACTIONS
   ========================================== */

function createActions(content){

    const actions =
    document.createElement("div");

    actions.className =
    "message-actions";

    const copyBtn =
    document.createElement("button");

    copyBtn.className =
    "action-btn";

    copyBtn.innerHTML =
    "📋 Copy";

    copyBtn.addEventListener(
    "click",
    () => copyMessage(content)
    );

    actions.appendChild(copyBtn);

    return actions;
}

/* ==========================================
   HIGHLIGHT CODE
   ========================================== */

function highlightCode(){

    if(!window.hljs) return;

    document
    .querySelectorAll("pre code")
    .forEach(block => {

        try{

            hljs.highlightElement(
            block
            );

        }catch(err){

            console.error(err);

        }

    });

}

/* ==========================================
   CREATE BUBBLE
   ========================================== */

function createBubble(role, content){

    const wrapper =
    document.createElement("div");

    wrapper.className =
    `message ${role}`;

    const contentWrap =
    document.createElement("div");

    contentWrap.className =
    "message-content";

    const avatar =
    document.createElement("div");

    avatar.className =
    `avatar ${
        role === "user"
        ? "user-avatar"
        : "ai-avatar"
    }`;

    avatar.innerHTML =
    role === "user"
    ? "👤"
    : "🤖";

    const bubble =
    document.createElement("div");

    bubble.className =
    "bubble";

    bubble.innerHTML =
    parseMarkdown(content);

    const actions =
    createActions(content);

    bubble.appendChild(actions);

    contentWrap.appendChild(
    avatar
    );

    contentWrap.appendChild(
    bubble
    );

    wrapper.appendChild(
    contentWrap
    );

    return wrapper;
}

/* ==========================================
   ADD MESSAGE TO UI
   ========================================== */

function addMessage(role, content){

    welcomeScreen.style.display =
    "none";

    const node =
    createBubble(
    role,
    content
    );

    chatMessages.appendChild(
    node
    );

    highlightCode();

    scrollToBottom();

    return node;
}

/* ==========================================
   STORE MESSAGE
   ========================================== */

function saveMessage(role, content){

    if(
        !currentChatId ||
        !chats[currentChatId]
    ){
        createNewChat();
    }

    const message =
    createMessage(
    role,
    content
    );

    chats[currentChatId]
    .messages
    .push(message);

    if(
        chats[currentChatId]
        .messages.length === 1 &&
        role === "user"
    ){

        chats[currentChatId]
        .title =
        content
        .substring(0,30);

        renderHistory();
    }

    saveChats();
}

/* ==========================================
   ADD + STORE
   ========================================== */

function addAndSaveMessage(
role,
content
){

    addMessage(
    role,
    content
    );

    saveMessage(
    role,
    content
    );

}

/* ==========================================
   LOAD STORED MESSAGE
   ========================================== */

function renderStoredMessage(msg){

    const role =
    msg.role;

    const content =
    msg.content;

    addMessage(
    role,
    content
    );
}

/* ==========================================
   SCROLL TO BOTTOM
   ========================================== */

function scrollToBottom(){

    requestAnimationFrame(
    () => {

        chatMessages.scrollTop =
        chatMessages.scrollHeight;

    });

}

/* ==========================================
   TYPING INDICATOR
   ========================================== */

function showTyping(){

    typingIndicator
    .classList
    .remove("hidden");

    scrollToBottom();
}

function hideTyping(){

    typingIndicator
    .classList
    .add("hidden");
}

/* ==========================================
   USER SEND MESSAGE
   ========================================== */

function getInputText(){

    return messageInput
    .value
    .trim();

}

function clearInput(){

    messageInput.value = "";

    charCount.textContent =
    "0 Characters";

    autoResizeTextarea();
}

function sendUserMessage(){

    const text =
    getInputText();

    if(!text) return;

    addAndSaveMessage(
    "user",
    text
    );

    clearInput();

    if(
        typeof askAI ===
        "function"
    ){

        askAI(text);

    }

}

/* ==========================================
   SEND EVENTS
   ========================================== */

sendBtn.addEventListener(
"click",
sendUserMessage
);

messageInput.addEventListener(
"keydown",
(e) => {

    if(
        e.key === "Enter" &&
        !e.shiftKey
    ){

        e.preventDefault();

        sendUserMessage();
    }

});

/* ==========================================
   LOADING MESSAGE
   ========================================== */

function createLoadingBubble(){

    const wrapper =
    document.createElement("div");

    wrapper.className =
    "message ai";

    wrapper.innerHTML = `
    <div class="message-content">

        <div class="avatar ai-avatar">
            🤖
        </div>

        <div class="bubble shimmer">
            Thinking...
        </div>

    </div>
    `;

    chatMessages.appendChild(
    wrapper
    );

    scrollToBottom();

    return wrapper;
}

/* ==========================================
   REMOVE LOADING
   ========================================== */

function removeLoadingBubble(
node
){

    if(node){

        node.remove();

    }

}

/* ==========================================
   CLEAR CHAT UI
   ========================================== */

function clearMessages(){

    chatMessages.innerHTML = "";

    welcomeScreen.style.display =
    "flex";
}

/* ==========================================
   DELETE CURRENT CHAT
   ========================================== */

function deleteCurrentChat(){

    if(
        !currentChatId ||
        !chats[currentChatId]
    ) return;

    delete chats[
    currentChatId
    ];

    saveChats();

    renderHistory();

    createNewChat();
}

/* ==========================================
   HELPER
   ========================================== */

function getCurrentMessages(){

    if(
        !currentChatId ||
        !chats[currentChatId]
    ){

        return [];

    }

    return chats[
    currentChatId
    ].messages;
}

/* ==========================================
   SMARTX AI
   APP.JS - PART 3
   OpenRouter Integration
   ========================================== */

const OPENROUTER_URL =
"https://openrouter.ai/api/v1/chat/completions";

/* ==========================================
   BUILD CHAT HISTORY
   ========================================== */

function buildMessages(){

    const history =
    getCurrentMessages();

    const messages = [
    {
        role:"system",
        content:`
You are SmartX AI,
an advanced AI assistant.

Be helpful.
Be accurate.
Use markdown formatting.
Provide code in code blocks.
        `
    }];

    history.forEach(msg => {

        messages.push({
            role:msg.role,
            content:msg.content
        });

    });

    return messages;
}

/* ==========================================
   STREAM EFFECT
   ========================================== */

async function typeResponse(
element,
text
){

    let output = "";

    const speed = 8;

    for(
        let i = 0;
        i < text.length;
        i++
    ){

        output += text[i];

        element.innerHTML =
        parseMarkdown(output);

        highlightCode();

        scrollToBottom();

        await new Promise(
        resolve =>
        setTimeout(
        resolve,
        speed
        )
        );

    }

}

/* ==========================================
   CREATE AI PLACEHOLDER
   ========================================== */

function createAIMessage(){

    const wrapper =
    document.createElement("div");

    wrapper.className =
    "message ai";

    wrapper.innerHTML = `
    <div class="message-content">

        <div class="avatar ai-avatar">
        🤖
        </div>

        <div class="bubble">
        Thinking...
        </div>

    </div>
    `;

    chatMessages.appendChild(
    wrapper
    );

    scrollToBottom();

    return wrapper;
}

/* ==========================================
   API REQUEST
   ========================================== */

async function requestAI(){

    const apiKey =
    localStorage.getItem(
    STORAGE.API_KEY
    );

    const model =
    localStorage.getItem(
    STORAGE.MODEL
    ) ||
    "openai/gpt-4o-mini";

    if(!apiKey){

        throw new Error(
        "OpenRouter API Key Missing"
        );

    }

    const response =
    await fetch(
    OPENROUTER_URL,
    {
        method:"POST",

        headers:{
            "Authorization":
            `Bearer ${apiKey}`,

            "Content-Type":
            "application/json",

            "HTTP-Referer":
            window.location.origin,

            "X-Title":
            "SmartX AI"
        },

        body:JSON.stringify({

            model,

            messages:
            buildMessages(),

            temperature:0.7,

            max_tokens:4000

        })
    }
    );

    if(!response.ok){

        const errorText =
        await response.text();

        throw new Error(
        errorText
        );

    }

    return response.json();
}

/* ==========================================
   MAIN AI FUNCTION
   ========================================== */

async function askAI(){

    showTyping();

    let loadingNode =
    null;

    try{

        loadingNode =
        createLoadingBubble();

        const data =
        await requestAI();

        hideTyping();

        removeLoadingBubble(
        loadingNode
        );

        const answer =
        data?.choices?.[0]
        ?.message?.content
        ||
        "No response received.";

        const aiNode =
        createAIMessage();

        const bubble =
        aiNode.querySelector(
        ".bubble"
        );

        bubble.innerHTML = "";

        await typeResponse(
        bubble,
        answer
        );

        highlightCode();

        saveMessage(
        "assistant",
        answer
        );

    }catch(error){

        console.error(error);

        hideTyping();

        removeLoadingBubble(
        loadingNode
        );

        addAndSaveMessage(
        "assistant",
        `❌ Error:\n\n${error.message}`
        );

    }

}

/* ==========================================
   REGENERATE RESPONSE
   ========================================== */

async function regenerateResponse(){

    const messages =
    getCurrentMessages();

    const lastUser =
    [...messages]
    .reverse()
    .find(
    m =>
    m.role === "user"
    );

    if(!lastUser) return;

    addMessage(
    "assistant",
    "_Regenerating response..._"
    );

    await askAI();
}

/* ==========================================
   MODEL INFO
   ========================================== */

function getCurrentModel(){

    return localStorage.getItem(
    STORAGE.MODEL
    ) ||
    "openai/gpt-4o-mini";
}

/* ==========================================
   STATUS CHECK
   ========================================== */

function hasApiKey(){

    return !!localStorage.getItem(
    STORAGE.API_KEY
    );

}

/* ==========================================
   STARTUP NOTICE
   ========================================== */

window.addEventListener(
"load",
() => {

    if(
        !hasApiKey()
    ){

        showToast(
        "Add OpenRouter API Key in Settings"
        );

    }

});

/* ==========================================
   SMARTX AI
   APP.JS - PART 4
   Voice, Export, Utilities
   ========================================== */

/* ==========================================
   ELEMENTS
   ========================================== */

const voiceBtn =
document.getElementById("voiceBtn");

const ttsBtn =
document.getElementById("ttsBtn");

const exportBtn =
document.getElementById("exportBtn");

const clearBtn =
document.getElementById("clearBtn");

/* ==========================================
   VOICE INPUT
   ========================================== */

let recognition = null;

if(
    "webkitSpeechRecognition" in window ||
    "SpeechRecognition" in window
){

    const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

    recognition =
    new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.continuous = false;

    recognition.interimResults = false;

    recognition.onresult = (event) => {

        const text =
        event.results[0][0].transcript;

        messageInput.value = text;

        autoResizeTextarea();

        charCount.textContent =
        `${text.length} Characters`;

        showToast("Voice Captured");

    };

    recognition.onerror = () => {

        showToast("Voice Error");

    };
}

voiceBtn?.addEventListener(
"click",
() => {

    if(!recognition){

        showToast(
        "Speech Recognition Not Supported"
        );

        return;
    }

    recognition.start();

    showToast(
    "Listening..."
    );

});

/* ==========================================
   TEXT TO SPEECH
   ========================================== */

function speakText(text){

    if(
        !("speechSynthesis" in window)
    ){

        showToast(
        "TTS Not Supported"
        );

        return;
    }

    speechSynthesis.cancel();

    const utterance =
    new SpeechSynthesisUtterance(
    text
    );

    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    speechSynthesis.speak(
    utterance
    );
}

ttsBtn?.addEventListener(
"click",
() => {

    const messages =
    getCurrentMessages();

    const lastAI =
    [...messages]
    .reverse()
    .find(
    msg =>
    msg.role === "assistant"
    );

    if(!lastAI){

        showToast(
        "No AI Message Found"
        );

        return;
    }

    speakText(
    lastAI.content
    );

});

/* ==========================================
   EXPORT CHAT
   ========================================== */

function exportCurrentChat(){

    if(
        !currentChatId ||
        !chats[currentChatId]
    ){

        showToast(
        "No Chat Available"
        );

        return;
    }

    const chat =
    chats[currentChatId];

    let text =
    `SmartX AI Export\n\n`;

    text +=
    `Chat: ${chat.title}\n\n`;

    chat.messages.forEach(
    msg => {

        text +=
        `[${msg.role.toUpperCase()}]\n`;

        text +=
        `${msg.content}\n\n`;

    });

    const blob =
    new Blob(
    [text],
    {
        type:"text/plain"
    }
    );

    const url =
    URL.createObjectURL(
    blob
    );

    const a =
    document.createElement("a");

    a.href = url;

    a.download =
    `${chat.title}.txt`;

    document.body.appendChild(
    a
    );

    a.click();

    a.remove();

    URL.revokeObjectURL(
    url
    );

    showToast(
    "Chat Exported"
    );
}

exportBtn?.addEventListener(
"click",
exportCurrentChat
);

/* ==========================================
   DELETE ALL CHATS
   ========================================== */

function deleteAllChats(){

    const confirmDelete =
    confirm(
    "Delete all chats?"
    );

    if(!confirmDelete)
    return;

    chats = {};

    currentChatId = null;

    localStorage.removeItem(
    STORAGE.CHATS
    );

    localStorage.removeItem(
    STORAGE.CURRENT_CHAT
    );

    historyContainer.innerHTML =
    "";

    clearMessages();

    createNewChat();

    showToast(
    "All Chats Deleted"
    );
}

clearBtn?.addEventListener(
"click",
deleteAllChats
);

/* ==========================================
   QUICK PROMPTS
   ========================================== */

document
.querySelectorAll(".prompt-btn")
.forEach(btn => {

    btn.addEventListener(
    "click",
    () => {

        messageInput.value =
        btn.textContent.trim();

        autoResizeTextarea();

        sendUserMessage();

    });

});

/* ==========================================
   MOBILE HISTORY AUTO CLOSE
   ========================================== */

historyContainer?.addEventListener(
"click",
() => {

    if(
        window.innerWidth <= 900
    ){

        sidebar.classList.remove(
        "show"
        );

    }

});

/* ==========================================
   AUTO SAVE
   ========================================== */

window.addEventListener(
"beforeunload",
() => {

    saveChats();

});

/* ==========================================
   SMARTX AI READY
   ========================================== */

console.log(`
====================================
 SmartX AI
 Made By Muhammad Hasan AI
 OpenRouter Connected
====================================
`);

showToast(
"SmartX AI Ready 🚀"
);