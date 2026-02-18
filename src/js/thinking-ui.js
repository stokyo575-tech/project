// thinking-ui.js - Qwen AI Thinking Display
// Menampilkan proses thinking AI seperti Qwen

class ThinkingUI {
  constructor() {
    this.container = document.getElementById('chat-window');
    this.isThinking = false;
  }

  // Tampilkan thinking state (fast animation)
  showThinking(userMessage) {
    this.isThinking = true;
    
    // Create thinking container - fast animation (200ms)
    const thinkingContainer = document.createElement('div');
    thinkingContainer.className = 'message-container thinking-container';
    thinkingContainer.innerHTML = `
      <div class="thinking-wrapper">
        <div class="thinking-header">
          <span class="thinking-label">🤔 Thinking</span>
          <div class="thinking-loader">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div class="thinking-content">
          <div class="thinking-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span class="thinking-text">Analyzing your request...</span>
        </div>
      </div>
    `;
    
    this.container.appendChild(thinkingContainer);
    this.container.scrollTop = this.container.scrollHeight;
    
    return thinkingContainer;
  }

  // Hide thinking dan show response (fast - 150ms)
  hideThinking(thinkingElement, aiResponse) {
    this.isThinking = false;
    
    if (thinkingElement && thinkingElement.parentNode) {
      // Quick fade out thinking
      thinkingElement.style.opacity = '0';
      thinkingElement.style.transition = 'opacity 0.15s ease';
      
      setTimeout(() => {
        if (thinkingElement.parentNode) {
          thinkingElement.remove();
        }
      }, 150);
    }
    
    // Display AI response immediately
    this.displayAIMessage(aiResponse);
  }

  displayUserMessage(message) {
    const container = document.createElement('div');
    container.className = 'message-container';
    
    const msg = document.createElement('div');
    msg.className = 'message user-message';
    msg.innerHTML = message
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
    
    container.appendChild(msg);
    this.container.appendChild(container);
    this.container.scrollTop = this.container.scrollHeight;
  }

  displayAIMessage(message) {
    const container = document.createElement('div');
    container.className = 'message-container ai-message-container';
    container.style.animation = 'fadeInUp 0.4s ease';
    
    const msg = document.createElement('div');
    msg.className = 'message ai-message';
    
    // Format message
    let formatted = message
      .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
        const esc = code.trim()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `<div class="code-container"><div class="code-header"><span class="code-language">${lang || 'code'}</span><button class="copy-button" onclick="handleCopy(this)">📋 Copy</button></div><pre><code>${esc}</code></pre></div>`;
      })
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    
    msg.innerHTML = formatted;
    container.appendChild(msg);
    this.container.appendChild(container);
    this.container.scrollTop = this.container.scrollHeight;
  }

  isCurrentlyThinking() {
    return this.isThinking;
  }
}

// Initialize globally
window.thinkingUI = new ThinkingUI();
