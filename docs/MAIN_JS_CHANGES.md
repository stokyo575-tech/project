// ===== MAIN.JS INTEGRATION GUIDE =====
// Perubahan yang diperlukan di main.js untuk integrasi chat logger

/*
PERUBAHAN PADA FILE main.js YANG SUDAH ADA:

1. Update saveCurrentChat() function (line ~107)
2. Add chatLogger calls di sendMessage() function
3. Refresh sidebar setelah new chat

DETAIL PERUBAHAN:
*/

// ===== CHANGE 1: Update saveCurrentChat() Function =====
// SEBELUM:
/*
function saveCurrentChat() {
    if (messages.length === 0) return;
    
    const chatData = {
        id: currentChatId || Date.now().toString(),
        title: messages[0].parts[0].text.substring(0, 50) + '...',
        messages: [...messages],
        timestamp: new Date().toISOString()
    };
    
    if (currentChatId) {
        const index = chatHistories.findIndex(chat => chat.id === currentChatId);
        if (index !== -1) {
            chatHistories[index] = chatData;
        }
    } else {
        chatHistories.unshift(chatData);
    }
    
    localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
    currentChatId = chatData.id;
}
*/

// SESUDAH:
function saveCurrentChat() {
    if (messages.length === 0) return;
    
    const chatData = {
        id: currentChatId || Date.now().toString(),
        title: messages[0].parts[0].text.substring(0, 50) + '...',
        messages: [...messages],
        timestamp: new Date().toISOString()
    };
    
    if (currentChatId) {
        const index = chatHistories.findIndex(chat => chat.id === currentChatId);
        if (index !== -1) {
            chatHistories[index] = chatData;
        }
    } else {
        chatHistories.unshift(chatData);
    }
    
    localStorage.setItem('chatHistories', JSON.stringify(chatHistories));
    currentChatId = chatData.id;
    
    // ===== NEW: Save ke backend =====
    if (window.chatLogger) {
        window.chatLogger.saveChatSession(chatData);
    }
    
    // ===== NEW: Refresh sidebar =====
    if (window.sidebarController) {
        window.sidebarController.refreshChatList();
    }
}

// ===== CHANGE 2: Add Logging di sendMessage() =====
// Di dalam function sendMessage(), setelah displayMessage(userMessage, 'user'):

async function sendMessage() {
    if (isProcessing) return;
    let userMessage = chatInput.value.trim();
    
    // ... file upload logic ...
    
    if (!userMessage) return;
    displayMessage(userMessage, 'user');

    // ===== NEW: Log user message =====
    if (window.chatLogger) {
        window.chatLogger.logToBackend(userMessage, 'user', currentChatId);
    }
    
    // ===== REST OF FUNCTION REMAINS SAME ===== //
    
    // Setelah AI respond dan message ditampilkan:
    displayMessage(aiContent, 'ai');
    messages.push({ role: 'model', parts: [{ text: aiContent }] });
    
    // ===== NEW: Log AI message =====
    if (window.chatLogger) {
        window.chatLogger.logToBackend(aiContent, 'ai', currentChatId);
    }
    
    success = true;
}

// ===== CHANGE 3: Update newChatBtn event =====
// SEBELUM:
/*
newChatBtn.addEventListener('click', () => {
    if (messages.length > 0) {
        saveCurrentChat();
    }
    currentChatId = null;
    messages = [];
    chatWindow.innerHTML = '';
    displayInitialMessage();
    chatInput.focus();
});
*/

// SESUDAH:
newChatBtn.addEventListener('click', () => {
    if (messages.length > 0) {
        saveCurrentChat();
    }
    currentChatId = null;
    messages = [];
    chatWindow.innerHTML = '';
    displayInitialMessage();
    chatInput.focus();
    
    // ===== NEW: Refresh sidebar =====
    if (window.sidebarController) {
        window.sidebarController.refreshChatList();
    }
});

// ===== CHANGE 4: Make functions accessible globally =====
// Tambahkan di akhir main.js sebelum closing brace

// Export functions for sidebar integration
window.newChatEvent = () => {
    if (messages.length > 0) {
        saveCurrentChat();
    }
    currentChatId = null;
    messages = [];
    chatWindow.innerHTML = '';
    displayInitialMessage();
    chatInput.focus();
};

window.loadChat = (chatId) => {
    const chat = chatHistories.find(c => c.id === chatId);
    if (!chat) return;
    
    currentChatId = chatId;
    messages = [...chat.messages];
    chatWindow.innerHTML = '';
    
    messages.forEach(msg => {
        const sender = msg.role === 'user' ? 'user' : 'ai';
        displayMessage(msg.parts[0].text, sender);
    });
    
    historyPanel.classList.remove('active');
    chatInput.focus();
};

// ===== SUMMARY =====
/*
PERUBAHAN MINIMAL untuk integrasi:

1. Di saveCurrentChat():
   - Tambah: window.chatLogger.saveChatSession(chatData);
   - Tambah: window.sidebarController.refreshChatList();

2. Di sendMessage():
   - Tambah: window.chatLogger.logToBackend(userMessage, 'user', currentChatId);
   - Tambah: window.chatLogger.logToBackend(aiContent, 'ai', currentChatId);

3. Export window functions:
   - window.newChatEvent
   - window.loadChat

SEMUA PERUBAHAN SUDAH OPTIONAL:
- Jika window.chatLogger tidak ada, tidak error
- Fallback ke localStorage jika backend tidak tersedia
*/
