// main-qwen-ui.js - Optimized sendMessage with Thinking UI
// Integrates Qwen AI thinking display

async function sendMessageWithThinking() {
    if (isProcessing) return;
    let userMessage = chatInput.value.trim();
    
    // Handle file upload
    if (uploadedFile) {
        try {
            const content = await readFileContent(uploadedFile);
            userMessage = `File: ${uploadedFile.name}\n\n\`\`\`\n${content}\n\`\`\`\n\n${userMessage || 'Tolong analisis kode ini.'}`;
            window.thinkingUI.displayUserMessage(userMessage);
            uploadedFile = null;
            fileInput.value = '';
            filePreview.classList.remove('active');
        } catch (error) {
            window.thinkingUI.displayAIMessage('❌ Gagal membaca file.');
            return;
        }
    } else {
        if (!userMessage) return;
        window.thinkingUI.displayUserMessage(userMessage);
    }

    // Security check
    if (isJailbreak(userMessage)) {
        window.thinkingUI.displayAIMessage('🚫 Permintaan ditolak – tidak boleh meminta jailbreak / bypass prompt.');
        chatInput.value = '';
        return;
    }

    messages.push({ role: 'user', parts: [{ text: userMessage }] });
    chatInput.value = '';
    chatInput.style.height = 'auto';
    isProcessing = true;
    sendButton.disabled = true;

    // Show thinking state
    const thinkingElement = window.thinkingUI.showThinking(userMessage);

    let attempts = 0;
    const maxAttempts = window.CONFIG.API_KEYS.length * 2;
    let success = false;

    while (attempts < maxAttempts && !success) {
        try {
            if (!currentApiKey) getRandomKey();
            if (!currentApiKey) throw new Error('API Key tidak tersedia.');

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${window.CONFIG.MODEL_NAME}:generateContent?key=${currentApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: messages,
                        systemInstruction: { parts: [{ text: window.CONFIG.SYSTEM_PROMPT }] },
                        generationConfig: {
                            maxOutputTokens: window.CONFIG.MAX_TOKENS,
                            temperature: 0.7,
                            topP: 0.95,
                            topK: 40
                        }
                    })
                }
            );

            if (!res.ok) {
                const err = await res.json();
                getRandomKey();
                throw new Error(`${res.status} - ${err.error?.message || 'Unknown'}`);
            }

            const result = await res.json();
            const aiContent = result.candidates?.[0]?.content?.parts?.[0]?.text;
            const finish = result.candidates?.[0]?.finishReason;

            if (!aiContent) {
                if (finish === 'SAFETY') throw new Error('Konten diblokir karena melanggar kebijakan keamanan.');
                if (finish === 'MAX_TOKENS') throw new Error('Respons terlalu panjang.');
                throw new Error('Respons AI kosong.');
            }

            // Hide thinking and show response
            window.thinkingUI.hideThinking(thinkingElement, aiContent);
            messages.push({ role: 'model', parts: [{ text: aiContent }] });
            success = true;
            setStatusOnline(true);

        } catch (err) {
            attempts++;
            console.error(`Attempt ${attempts} failed:`, err);

            if (attempts < maxAttempts) {
                getRandomKey();
                await new Promise(r => setTimeout(r, Math.pow(2, attempts) * 100));
            } else {
                window.thinkingUI.hideThinking(
                    thinkingElement,
                    `❌ **Gagal Menghubungi API** (${maxAttempts} percobaan)\n\n${err.message}\n\n**Solusi:**\n1. Periksa koneksi internet\n2. API key mungkin mencapai limit\n3. Coba lagi dalam beberapa saat\n4. Sederhanakan pertanyaan\n\n💡 Klik tombol refresh API untuk key baru`
                );
                setStatusOnline(false);
                messages.pop();
            }
        }
    }

    isProcessing = false;
    sendButton.disabled = false;
    sendButton.innerHTML = '<span class="button-text">Kirim</span>';
    chatInput.focus();

    if (success) {
        saveCurrentChat();
    }
}

// Replace original sendMessage
window.sendMessageWithThinking = sendMessageWithThinking;
